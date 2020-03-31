/*

gvtc.http

*/


( function () {

    window.gvtc = window.gvtc || {};

    var AUTH_KEY = "access_token",
        GROUP_KEY = "cognito:groups";

    gvtc.http = {

        baseUrl: "/",

        cacheValue: function ( options ) {

            return localforage.setItem( options.key, options.value );

        },

        /** @function cacheTTLValue
            options: {
                key: lookup key
                value: value
                ttl: # of seconds till data becomes stale
            }
        */
        cacheTTLValue: function ( options ) {

            return this.cacheValue( options )
                .then( function () {

                    if ( options.ttl && !Number.isNaN( options.ttl ) ) {

                        var now = new Date();
                        now.setSeconds( now.getSeconds() + ( options.ttl * 1000 ) );

                        return localforage.setItem( options.key + "-ttl", now );

                    }

                    return;

                } );

        },

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

                                        value = value ? value.Data : undefined;

                                        if ( value && value.length ) {
                                            value = value.length > 0 ? value : undefined;
                                        }

                                        if ( value ) {

                                            gvtc.http.cacheTTLValue( {
                                                key: options.key,
                                                value: value,
                                                ttl: options.ttl
                                            } );

                                        }

                                        return value;

                                    } );
                            }

                        } );

                } );

        },

        validateResponse: function ( response ) {

            switch ( response.status ) {

                case 500:

                    location.replace( "error/" );
                    break;

                case 401:

                    //no authentication
                    localforage.removeItem( AUTH_KEY )
                        .then( function () {

                            //this should mean the token has expired or is missing
                            location.replace( "login/" );

                        } );

                    break;
                    // ...

                case 0: //opaque cross origin request
                case 200: //good response
                case 201: //object created
                case 202: //good but processing is still happening. Poll to update process
                case 204: //no record
                case 205: //Email Already exist.
                case 300: //record exists
                case 404: //not found
                case 403: //not authorized
                case 406: //please register yourself

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

            myHeaders[ "Accept" ] = "application/json, text/plain, */*";

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

            //            options.url = api.baseUrl + options.url;

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

            var groups,
                auth;

            var api = this;

            return localforage.getItem( GROUP_KEY )
                .then( function ( g ) {
                    groups = JSON.stringify( g );

                    //should only need to validate GET 
                    //POST, PUT, DELETE requests should return 4xx Status codes when not authenticated
                    return localforage.getItem( AUTH_KEY );

                } )
                .then( function ( token ) {

                    if ( token ) {
                        //user/
                        options.headers = {
                            "Groups": groups,
                            "Authorization": "bearer " + token,
                            'Content-Type': 'application/json'
                        };

                        return api.fetch( options )
                            .then( function ( response ) {

                                if ( response.status === 403 ) {
                                    location.href = "login/";
                                }

                                return response;
                            } );

                    }
                    //deal with a logout process
                    //not sure what that looks like

                } );


        },

        getBody: function ( options ) {

            if ( !options.ContentType || options.ContentType === "application/json" ) {

                if ( options.body && typeof options.body === "object" ) {
                    options.body = JSON.stringify( options.body );
                }

            }

            return options;
        }

    };

    window.gvtc.http = gvtc.http;

}() );