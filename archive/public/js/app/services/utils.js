( function () {

    window.gvtc = window.gvtc || {};

    function readUploadedCSV( file ) {

        return new Promise( function ( resolve, reject ) {

            var data = null;
            var reader = new FileReader();

            reader.readAsText( file );

            reader.onload = function ( event ) {

                var data = csvJSON( event.target.result );

                if ( data ) {
                    console.log( "Imported -" + data.length );

                    resolve( data );

                } else {

                    reject( 'No data to import!' );

                }

            };

            reader.onerror = function () {
                reject( 'Unable to read ' + file.fileName );
            };

        } );

    }

    function csvJSON( csv ) {

        var lines = csv.split( "\n" );

        var result = [];

        var headers = lines[ 0 ].split( /\t|,/ );

        for ( var i = 1; i < lines.length; i++ ) {

            var obj = {};
            var currentline = lines[ i ].split( /\t|,/ );

            for ( var j = 0; j < headers.length; j++ ) {
                obj[ headers[ j ].trim() ] = currentline[ j ];
            }

            result.push( obj );

        }

        return result; //JavaScript object
        //return JSON.stringify( result ); //JSON
    }


    window.gvtc.utils = {

        parse: function ( obj ) {

            if ( typeof obj === "string" ) {

                obj = JSON.parse( obj );

            }

            return obj;
        },

        stringify: function ( value ) {

            if ( typeof value === "object" ) {
                value = JSON.stringify( value );
            }

            return value;
        },

        nameSpace: function ( root, ns ) {

            if ( !ns ) {
                ns = root;
                root = window;
            }

            var parts = ns.split( '.' ),
                parent = root,
                i;

            // strip redundant leading global
            if ( parts[ 0 ] === root.toString() ) {
                parts = parts.slice( 1 );
            }

            for ( i = 0; i < parts.length; i += 1 ) { // create a property if it doesn't exist

                if ( typeof parent[ parts[ i ] ] === "undefined" ) {
                    parent[ parts[ i ] ] = {};
                }

                parent = parent[ parts[ i ] ];

            }

            return parent;
        },

        queryStringtoJSON: function () {

            var pairs = location.search.slice( 1 ).split( '&' );

            var result = {};
            pairs.forEach( function ( pair ) {
                pair = pair.split( '=' );
                result[ pair[ 0 ] ] = decodeURIComponent( pair[ 1 ] || '' );
            } );

            return result;

        },

        jsonToQueryString: function ( json ) {

            if ( !json ) {
                return "";
            }

            return '?' +
                Object.keys( json ).map( function ( key ) {
                    return encodeURIComponent( key ) + '=' +
                        encodeURIComponent( json[ key ] );
                } ).join( '&' );
        },

        readUploadedCSV: readUploadedCSV

    };

}() );