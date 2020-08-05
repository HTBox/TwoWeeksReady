/* global Buffer, escape, module, require */

"use strict";

const fs = require( "fs" ),
    path = require( "path" ),
    stripBom = require( "strip-bom" ),
    crypto = require( "crypto" ),
    mime = require( "mime-types" ),
    template = require( "mustache" ),
    utf8 = "utf-8";

const randomChar = () => {
    return String.fromCharCode( 65 + Math.floor( Math.random() * 26 ) );
};

const randomId = () => {
    return randomChar() + Date.now() + randomChar();
};

const RESP_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Allow": "GET, OPTIONS, POST, DELETE",
    "Access-Control-Allow-Methods": "GET, OPTIONS, POST, DELETE",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
};

let type = {
    lower: "abcdefghijklmnopqrstuvwxyz",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    number: "0123456789",
    special: "~!@#$%^&()_+-={}[];\",."
};

type.all = type.lower + type.upper + type.number + type.special;

function parse( value ) {

    if ( !value ) {
        return {};
    }

    if ( typeof value === "string" ) {

        value = JSON.parse( value );

    }

    return value;

}

function stringify( value ) {

    if ( !value ) {
        return "";
    }

    if ( typeof value !== "string" ) {

        value = JSON.stringify( value );

    }

    return value;

}

function isNumeric( n ) {
    return !isNaN( parseFloat( n ) ) && isFinite( n );
}

function atob( str ) {

    return Buffer.from( str, "base64" ).toString();

}

function decodeJWT( jwt ) {

    if ( jwt === "" ) {
        return "";
    }

    if ( typeof jwt === "object" && jwt.token ) {
        jwt = jwt.token;
    }

    jwt = jwt.replace( /bearer/gi, "" );

    var segments = jwt.split( "." ),
        content;

    if ( segments.length != 3 ) {
        throw "JWT is required to have three segments";
    }

    content = base64URLDecode( segments[ 1 ] );

    return content;

}

function base64URLDecode( base64UrlEncodedValue ) {

    var result,
        newValue = base64UrlEncodedValue
        .replace( "-", "+" )
        .replace( "_", "/" );

    try {

        result = decodeURIComponent( escape( atob( newValue ) ) );

    } catch ( e ) {
        throw "Base64URL decode of JWT segment failed";
    }

    return parse( result );
}

function OK( body, callback ) {

    httpRespond( body, callback, 200 );
}

function httpRespond( body, callback, status ) {

    if ( !body ) {
        body = "";
    }

    if ( typeof body !== "string" ) {
        body = stringify( body );
    }

    callback( null, {
        statusCode: status || 200,
        "headers": RESP_HEADERS,
        body: body
    } );

}

function belongsToCognitoGroup( headers, expected ) {

    if ( !headers ) {
        return false;
    }

    let token = headers.Authorization || headers.authorization || "";

    if ( !token ) {
        return false;
    }

    token = decodeJWT( token );

    let group = token[ "cognito:groups" ];

    if ( typeof group === "string" ) {
        group = parse( group );
    }

    if ( !Array.isArray( group ) ) {
        group = [ group ];
    }

    if ( !Array.isArray( expected ) ) {
        expected = [ expected ];
    }

    let isAuthorized = false;

    for ( let index = 0; index < expected.length; index++ ) {

        if ( group.includes( expected[ index ] ) ) {
            isAuthorized = true;
        }

    }

    return isAuthorized;

}

function cleanEmptyObjectProperties( obj ) {

    let ex = obj;

    for ( let key in ex ) {

        if ( ex.hasOwnProperty( key ) ) {

            if ( ex[ key ] === "" ) {
                delete ex[ key ];
            } else if ( typeof ex[ key ] === "object" ) {

                ex[ key ] = cleanEmptyObjectProperties( ex[ key ] );

            }

        }

    }

    return ex;

}

module.exports = {

    generatePassword: function ( pattern, length, options ) {

        if ( typeof pattern === "undefined" ) {
            throw new Error( "randomatic expects a string or number." );
        }

        var custom = false;

        if ( arguments.length === 1 ) {
            if ( typeof pattern === "string" ) {
                length = pattern.length;

            } else if ( isNumeric( pattern ) ) {
                options = {};
                length = pattern;
                pattern = "*";
            }
        }

        if ( typeof length === "object" &&
            length.hasOwnProperty( "chars" ) ) {

            options = length;
            pattern = options.chars;
            length = pattern.length;
            custom = true;
        }

        var opts = options || {};
        var mask = "";
        var res = "";

        // Characters to be used
        if ( pattern.indexOf( "?" ) !== -1 ) mask += opts.chars;
        if ( pattern.indexOf( "a" ) !== -1 ) mask += type.lower;
        if ( pattern.indexOf( "A" ) !== -1 ) mask += type.upper;
        if ( pattern.indexOf( "0" ) !== -1 ) mask += type.number;
        if ( pattern.indexOf( "!" ) !== -1 ) mask += type.special;
        if ( pattern.indexOf( "*" ) !== -1 ) mask += type.all;
        if ( custom ) mask += pattern;

        // Characters to exclude
        if ( opts.exclude ) {

            let exclude = typeof opts.exclude === "string" ?
                opts.exclude : opts.exclude.join( "" );

            exclude = exclude.replace( new RegExp( "[\\]]+", "g" ), "" );
            mask = mask.replace( new RegExp( "[" + exclude + "]+", "g" ), "" );

            if ( opts.exclude.indexOf( "]" ) !== -1 ) {

                mask = mask.replace( new RegExp( "[\\]]+", "g" ), "" );

            }
        }

        while ( length-- ) {
            res += mask.charAt( parseInt( Math.random() * mask.length, 10 ) );
        }

        return res;

    },

    getMimeType: function ( name ) {

        return mime.lookup( name );

    },

    getHash: function ( data ) {

        if ( typeof data === "object" ) {
            data = JSON.stringify( data );
        }

        let md5 = crypto.createHash( "md5" );

        md5.update( data );

        return md5.digest( "hex" );
    },

    unixifyPath: function ( filepath ) {
        if ( isWindows ) {
            return filepath.replace( /\\/g, "/" );
        } else {
            return filepath;
        }
    },

    MakeDirectory: function ( target ) {

        if ( !fs.existsSync( target ) ) {
            fs.mkdirSync( target );
        }

    },

    copyFileSync: function ( srcFile, destFile, override ) {

        override = override || this.project.overwrite;

        if ( !fs.existsSync( srcFile ) || override ) {

            this.createFile( destFile, fs.readFileSync( srcFile, utf8 ), override );

        }
    },

    capitalizeFirstLetter: function ( str ) {

        if ( typeof str === "string" ) {
            return str.replace( /^\w/, c => c.toUpperCase() );
        } else {
            return "";
        }

    },

    makeSlug: function ( src ) {

        if ( typeof src === "string" ) {

            return src.replace( / +/g, "-" )
                .replace( /\"/g, "" )
                .replace( /[^\w-]+/g, "" )
                .replace( /-+/g, "-" )
                .toLowerCase();

        }

        return "";

    },

    createFile: function ( target, body, override ) {

        override = override || false;

        if ( !fs.existsSync( target ) || override ) {

            if ( !fs.existsSync( path.dirname( target ) ) ) {

                console.log( "making directory ", path.dirname( target ) );

                fs.mkdirSync( path.dirname( target ) );

            }

            fs.writeFileSync( target, body, utf8 );
        }

    },

    render: function ( src, data ) {

        return template.render( src, data );

    },

    generateFile: function ( src, dest, data, override ) {

        override = override || false;

        if ( !fs.existsSync( dest ) || override ) {

            var content = fs.readFileSync( src, utf8 );

            this.createFile( dest, template.render( content, data ), override );

        }

    },

    readFile: function ( src ) {

        if ( fs.existsSync( src ) ) {

            return stripBom( fs.readFileSync( src, utf8 ) );

        } else {
            return undefined;
        }

    },

    readJSON: function ( src ) {

        let content = this.readFile( src );

        if ( content ) {

            return this.parse( content );

        }

    },

    writeJSON: function ( target, body, overwrite ) {

        return this.createFile( target, this.stringify( body ), overwrite );

    },

    ensureFilePath: function ( target ) {

        var folder = path.dirname( target ),
            folders = folder.toLowerCase().replace( /c:\\/g, "" ).split( "\\" ),
            targetFolder = "c:\\";

        for ( var i = 0; i < folders.length; i++ ) {

            if ( targetFolder === "c:\\" ) {

                targetFolder += folders[ i ];

            } else {

                targetFolder += "\\" + folders[ i ];

            }

            if ( !fs.existsSync( targetFolder ) ) {

                fs.mkdirSync( targetFolder );

            }

        }

    },

    titleCase: function ( str ) {

        if ( str ) {

            return str.replace(
                /\w\S*/g,
                function ( txt ) {
                    return txt.charAt( 0 ).toUpperCase() + txt.substr( 1 ).toLowerCase();
                }
            );

        } else {

            return "";

        }
    },

    getNextModule: function ( page, current ) {

        let index = page.modules.indexOf( current );

        if ( index !== page.modules.length ) {

            return page.modules[ index + 1 ];

        }

    },

    pad: function ( num, size ) {

        var s = num + "";

        while ( s.length < size ) s = "0" + s;

        return s;
    },

    convertOnOfftoBool: function ( value ) {

        if ( value === "on" ) {
            return true;
        }

        if ( value === "off" ) {
            return true;
        }

        return value;

    },

    getNextAction: function ( page, currentAction ) {

        let index = page.actions.findIndex( function ( action ) {
            return action === currentAction;
        } );

        if ( index > -1 ) {

            return page.actions[ index ];

        }

        return null;

    },

    parseChildObjects: function ( page ) {

        page.modules = this.parse( page.modules );
        page.preloads = this.parse( page.preloads );
        page.css = this.parse( page.css );
        page.images = this.parse( page.images );
        page.image = this.parse( page.image );
        page.scripts = this.parse( page.scripts );
        page.tags = this.parse( page.tags );
        page.related = this.parse( page.related );

        return page;

    },

    generateUUID: function () { // Public Domain/MIT

        var d = new Date().getTime();

        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
            .replace( /[xy]/g,
                function ( c ) {

                    var r = ( d + Math.random() * 16 ) % 16 | 0;

                    d = Math.floor( d / 16 );

                    return ( c === "x" ? r : ( r & 0x3 | 0x8 ) ).toString( 16 );

                } );

    },

    getInitials: function ( str ) {
        return str.replace( " - ", " " ).split( " " ).map( ( n ) => n[ 0 ] ).join( "" ).substring( 0, 2 ).toUpperCase();
    },

    decodeJWT: decodeJWT,
    utf8: utf8,
    randomChar: randomChar,
    randomId: randomId,
    parse: parse,
    stringify: stringify,
    base64URLDecode: base64URLDecode,
    belongsToCognitoGroup: belongsToCognitoGroup,
    httpRespond: httpRespond,
    OK: OK,
    cleanEmptyObjectProperties: cleanEmptyObjectProperties

};