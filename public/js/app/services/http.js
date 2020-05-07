/*

love2dev.http

*/


( function () {

    var AUTH_KEY = "access_token",
        ID_KEY = "id_token",
        GROUP_KEY = "cognito:groups",
        defaultTTL = 60 * 15;

    function getBody( options ) {

        if ( !options.ContentType || options.ContentType.includes( "application/json" ) ) {

            if ( options.body && typeof options.body === "object" ) {
                options.body = JSON.stringify( options.body );
            }

        }

        return options;
    }

    /** @function cacheTTLValue
        options: {
            key: lookup key
            value: value
            ttl: # of seconds till data becomes stale
        }
    */
    function cacheTTLValue( options ) {

        return cacheValue( options )
            .then( function () {

                if ( options.ttl && !Number.isNaN( options.ttl ) ) {

                    var now = new Date().getTime();

                    return localforage.setItem( options.key + "-ttl", now + ( options.ttl * 1000 ) );

                }

                return;

            } );

    }

    function cacheValue( options ) {

        return localforage.setItem( options.key, options.value );

    }

    love2dev.http = {

        baseUrl: "/",

        cacheValue: cacheValue,

        cacheTTLValue: cacheTTLValue,

        deleteCacheValue: function ( key ) {

            return localforage.removeItem( key )
                .then( function () {

                    return localforage.removeItem( key + "-ttl" );

                } );

        },

        checkCachedValue: function ( key ) {

            return localforage.getItem( key );

        },

        checkCachedValueStaleness: function ( key ) {

            return this.checkCachedValue( key + "-ttl" )
                .then( function ( ttl ) {

                    var d1 = new Date();
                    var d2 = new Date( ttl );

                    if ( !ttl || d1 < d2 ) {

                        return localforage.getItem( key );
                    }

                    return;

                } );

        },

        cacheAndFetch: function ( options ) {

            var self = this;

            options.ttl = options.ttl || defaultTTL;

            return self.checkCachedValueStaleness( options.key )
                .then( function ( value ) {

                    if ( value ) {

                        return value;

                    }

                    return self.get( {
                            url: options.url
                        } )
                        .then( function ( response ) {

                            if ( response.ok ) {

                                return response.json()
                                    .then( function ( value ) {

                                        if ( value ) {

                                            if ( typeof value === "string" ) {

                                                value = JSON.parse( value );

                                            }

                                            return cacheTTLValue( {
                                                    key: options.key,
                                                    value: value,
                                                    ttl: options.ttl
                                                } )
                                                .then( function () {
                                                    return value;
                                                } );

                                        } else {

                                            return value;

                                        }

                                    } );
                            }

                        } );

                } );

        },

        postAndClearCache: function ( options ) {

            return this.post( options )
                .then( function ( response ) {

                    if ( response.ok ) {

                        if ( options.key ) {
                            return localforage.removeItem( options.key )
                                .then( function () {
                                    return response.json()
                                        .then( function ( result ) {
                                            return result.Item;
                                        } );
                                } );

                        } else {

                            return response.json()
                                .then( function ( result ) {
                                    return result.Item;
                                } );

                        }

                    }

                } );

        },

        validateResponse: function ( response ) {

            switch ( response.status ) {

                // case 500:

                //     location.replace( "error/" );
                //     break;

                case 401:
                case 403:
                    //no authentication

                    console.log( "no authentication" );
                    //localforage.removeItem( AUTH_KEY )
                    //    .then( function () {

                    //this should mean the token has expired or is missing
                    //love2dev.app.goToLogin();

                    //} );

                    break;
                    // ...

                    // case 0: //opaque cross origin request
                    // case 200: //good response
                    // case 201: //object created
                    // case 202: //good but processing is still happening. Poll to update process
                    // case 204: //no record
                    // case 205: //Email Already exist.
                    // case 300: //record exists
                    // case 404: //not found
                    // case 406: //please register yourself
                default:

                    return response;

            }

        },

        setHeaders: function ( ContentType ) {

            var myHeaders = {};

            if ( ContentType ) {
                myHeaders[ "Content-Type" ] = ContentType;
            } else {
                myHeaders[ "Content-Type" ] = "application/json";
            }

            myHeaders.Accept = "application/json, text/plain, */*";

            return myHeaders;
        },

        fetch: function ( options ) {

            var api = this;

            if ( !options.headers ) {

                options.headers = api.setHeaders( options.ContentType );

            }

            options = Object.assign( {}, {
                method: "GET"
                //                ,mode: 'cors'
            }, options );

            return fetch( options.url, options )
                .then( function ( response ) {
                    return api.validateResponse( response );
                } );
        },

        get: function ( options ) {

            options.method = "GET";

            return this.fetch( options );

        },

        patch: function ( options ) {

            options.method = "PATCH";

            options = getBody( options );

            return this.fetch( options );

        },

        post: function ( options ) {

            options.method = "POST";

            options = getBody( options );

            return this.fetch( options );

        },

        put: function ( options ) {

            options.method = "PUT";

            options = getBody( options );

            return this.fetch( options );

        },

        delete: function ( options ) {

            options.method = "DELETE";

            if ( options.id && typeof options.id === "object" ) {
                options.id = ( options.id );
            }
            return this.fetch( options );

        },

        authorized: function ( options ) {

            var api = this;

            return localforage.getItem( ID_KEY )
                .then( function ( token ) {

                    if ( token ) {
                        //user/
                        options.headers = {
                            //"Groups": groups,
                            "Authorization": "Bearer " + token,
                            'Content-Type': 'application/json'
                        };

                        return api.fetch( options );

                    } else {

                        options.headers = {
                            'Content-Type': 'application/json'
                        };

                        return api.fetch( options );

                    }
                    //deal with a logout process
                    //not sure what that looks like

                } );


        },

        getBody: getBody

    };

    love2dev.http = love2dev.http;

}() );