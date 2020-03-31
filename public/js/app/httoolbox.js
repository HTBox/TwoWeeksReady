( function () {

    gvtc.utils.nameSpace( "gvtc.files" );

    var apiBase = "api/",
        configLifeSpan = 1000 * 60 * 2; //1 hour

    var type = {
        lower: 'abcdefghijklmnopqrstuvwxyz',
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        number: '0123456789',
        special: '~!@#$%^&()_+-={}[];\',.'
    };

    type.all = type.lower + type.upper + type.number + type.special;


    function getAPIURL( obj, options ) {

        var url = apiBase + obj;

        if ( options && typeof options === "object" ) {
            url += jsonToQueryString( options );
        }

        return url;

    }

    function queryStringtoJSON() {

        var pairs = location.search.slice( 1 ).split( '&' );

        var result = {};
        pairs.forEach( function ( pair ) {
            pair = pair.split( '=' );
            result[ pair[ 0 ] ] = decodeURIComponent( pair[ 1 ] || '' );
        } );

        return result;

    }

    function jsonToQueryString( json ) {

        if ( !json ) {
            return "";
        }

        return '?' +
            Object.keys( json ).map( function ( key ) {
                return encodeURIComponent( key ) + '=' +
                    encodeURIComponent( json[ key ] );
            } ).join( '&' );
    }

    function generatePassword( pattern, length, options ) {

        if ( typeof pattern === 'undefined' ) {
            throw new Error( 'randomatic expects a string or number.' );
        }

        var custom = false;

        if ( arguments.length === 1 ) {
            if ( typeof pattern === 'string' ) {
                length = pattern.length;

            } else if ( isNumeric( pattern ) ) {
                options = {};
                length = pattern;
                pattern = '*';
            }
        }

        if ( typeof length === 'object' &&
            length.hasOwnProperty( 'chars' ) ) {

            options = length;
            pattern = options.chars;
            length = pattern.length;
            custom = true;
        }

        var opts = options || {};
        var mask = '';
        var res = '';

        // Characters to be used
        if ( pattern.indexOf( '?' ) !== -1 ) mask += opts.chars;
        if ( pattern.indexOf( 'a' ) !== -1 ) mask += type.lower;
        if ( pattern.indexOf( 'A' ) !== -1 ) mask += type.upper;
        if ( pattern.indexOf( '0' ) !== -1 ) mask += type.number;
        if ( pattern.indexOf( '!' ) !== -1 ) mask += type.special;
        if ( pattern.indexOf( '*' ) !== -1 ) mask += type.all;
        if ( custom ) mask += pattern;

        // Characters to exclude
        if ( opts.exclude ) {

            let exclude = typeof opts.exclude === 'string' ?
                opts.exclude : opts.exclude.join( '' );

            exclude = exclude.replace( new RegExp( '[\\]]+', 'g' ), '' );
            mask = mask.replace( new RegExp( '[' + exclude + ']+', 'g' ), '' );

            if ( opts.exclude.indexOf( ']' ) !== -1 ) {

                mask = mask.replace( new RegExp( '[\\]]+', 'g' ), '' );

            }
        }

        while ( length-- ) {
            res += mask.charAt( parseInt( Math.random() * mask.length, 10 ) );
        }

        return res;

    }

    gvtc.apiURLBase = apiBase;
    gvtc.getAPIURL = getAPIURL;
    gvtc.jsonToQueryString = jsonToQueryString;
    gvtc.queryStringtoJSON = queryStringtoJSON;
    gvtc.generatePassword = generatePassword;

}() );