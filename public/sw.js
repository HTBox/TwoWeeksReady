importScripts( "js/libs/localforage.min.js",
    "js/libs/mustache.min.js" );


//remember to increment the version # when you update the service worker
const version = "0.02",
    preCache = "PRECACHE-" + version,
    cacheList = [ "/",
        "css/animate.min.css",
        "css/bootstrap.min.css",
        "css/all.min.css",
        "css/mdb.min.css",
        "css/appbar.css",
        "css/site.css",
        "img/2-weeks-ready-rectangle-320x118.png",
        "css/mdc.snackbar.min.css",
        "css/addtohomescreen.css",
        "js/libs/mustache.min.js",
        "js/libs/addtohomescreen.min.js",
        "js/libs/localforage.min.js",
        "js/app/ui/component.base.js",
        "js/app/ui/snackbar.js",
        "js/app/services/http.js",
        "js/app/services/utils.js",
        "js/app/services/auth.js",
        "js/app/services/data.js",
        "js/app/services/httoolbox.js",
        "js/app.js",
        "js/app/controllers/home.js",
        "js/app/controllers/home.js",
        "webfonts/fa-solid-900.woff2",
        "webfonts/fa-brands-400.woff2",
        "img/first-aid-908591_1920.jpg",
        "img/pacific-northwest-earthquake-map-last-20-years.jpg",
        "img/pipe-2445176_1920.jpg",
        "img/water-fight-442257_1920.jpg",
        "img/writing-828911_1920.jpg",
        "offline/"
    ],
    OFFLINE_MSG_KEY = "toggle-online",
    USER_PROFILE = "user_profile",
    UPDATE_DATA = "update-data",
    STALE_KEY = "-expires",
    MAX_LIST_CACHE = 15;


/*
create a list (array) of urls to pre-cache for your application
*/

/*  Service Worker Event Handlers */

self.addEventListener( "install", function ( event ) {

    console.log( "Installing the service worker!" );

    self.skipWaiting();

    event.waitUntil(

        caches.open( preCache )
        .then( cache => {

            cacheList.forEach( url => {

                fetch( url )
                    .then( function ( response ) {
                        if ( !response.ok ) {
                            throw new TypeError( 'bad response status - ' + response.url );
                        }
                        return cache.put( url, response );
                    } )
                    .catch( err => {
                        console.error( err );
                    } );

            } );

        } )

    );

} );

self.addEventListener( "activate", function ( event ) {

    event.waitUntil(

        //wholesale purge of previous version caches
        caches.keys().then( cacheNames => {
            cacheNames.forEach( value => {

                if ( value.indexOf( version ) < 0 ) {
                    caches.delete( value );
                }

            } );

            console.log( "service worker activated" );

            return;

        } )

    );

} );

self.addEventListener( "fetch", function ( event ) {

    event.respondWith(

        caches.match( event.request )
        .then( response => {

            return response || fetch( event.request )
                .then( response => {

                    let clone = response.clone();

                    if ( response.ok ) {

                        caches.open( "dynamic-cache" )
                            .then( cache => {

                                cache.put( event.request, clone );
                            } );

                    }

                    return response;
                } )
                .catch( err => {

                    return caches.match( "offline/" );

                } );

        } )

        /* check the cache first, then hit the network */
        /*
                caches.match( event.request )
                .then( function ( response ) {

                    if ( response ) {
                        return response;
                    }

                    return fetch( event.request );
                } )
        */
    );

} );