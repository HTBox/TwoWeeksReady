/*
This is a common data service module that handles
common repeated logic patterns used by all the 
distinct object types.
Ultimately we want to perform these operations in the
service worker and trigger the actions either via
a URL request or a messaging routine
*/

( function () {

    "use strict";

    gvtc.utils.nameSpace( "gvtc.data" );

    var _STALE_KEY = "-expires",
        MAX_LIST_CACHE = 15;

    //actually get individual item from local cache rather than from cloud DB
    //this routine should keep the local cache fresh while reducing network traffic
    //and database load
    //even for a large operation with lots of parts this should not be a 
    //big data burder as we can easily cache several MB of parts and order histories
    //plus technicians will be the primary candidate for offline issues and
    //they really just need the parts and their own orders to access.
    function getItem( options, apiURL, ITEM_KEY ) {

        //perform specific object validation before this level
        //at a minimum the criteria should include an id since all single
        //items will require an assetId to filter the result and the assetId
        //is a unique UUID value
        if ( !options && ( !options.id ) ) {

            return Promise.reject( "no valid item selection criteria supplied" );

        }

        //most likely coming from IDB
        return getItems( options, apiURL, ITEM_KEY )
            .then( function ( items ) {

                if ( !items.length ) {

                    return items;

                } else {

                    for ( var index = 0; index < items.length; index++ ) {

                        var item = items[ index ];

                        //custom object comparison routine
                        if ( options.compare ) {

                            if ( options.compare( item ) ) {
                                return item;
                            }

                        } else {

                            if ( options.id === item[ options.idName ] ) {

                                return item;

                            }

                        }

                    }

                }

            } );

    }

    function getItems( options, apiURL, ITEM_KEY ) {

        return getLocalItems( options, ITEM_KEY )
            .then( function ( items ) {

                if ( ( items && items.length > 0 ) && !options.forceUpdate ) {
                    return items;
                } else {

                    //the apiURL should be completed before this layer
                    //should include all queryString parameters to drive the 
                    //API request
                    return gvtc.http.get( {
                            "method": "GET",
                            //       "mode": "cors",
                            "url": apiURL
                        } )
                        .then( function ( response ) {

                            if ( response.ok ) {

                                return response.json();

                            }

                            throw response.status;

                        } )
                        .then( function ( items ) {

                            if ( items.length && items.length > 0 ) {

                                return saveLocalItems( items, ITEM_KEY );

                            } else {

                                return Promise.resolve( items );

                            }

                        } );

                }

            } );

    }

    function updateItem( options, apiURL, ITEM_KEY ) {

        if ( !options.body ) {
            return Promise.reject( "no item object supplied" );
        }

        options.body.date_updated = new Date().toISOString();

        return gvtc.http.authorized( {
                "method": "POST",
                "mode": "cors",
                "url": apiURL,
                "body": JSON.stringify( options.body )
            } )
            .then( function ( response ) {

                if ( response.ok ) {

                    return response.json();

                }

                //could postMessage to service worker to update cached list here
            } )
            .then( function ( resp ) {

                console.log( resp );

                return getItems( {
                    "forceUpdate": true
                }, apiURL, ITEM_KEY );

            } )
            .then( function () {
                return options.body;
            } );

    }

    function deleteItem( options, apiURL, ITEM_KEY ) {

        return gvtc.http.authorized( {
                "method": "DELETE",
                "mode": "cors",
                "url": apiURL
            } )
            .then( function ( response ) {

                if ( response.ok ) {

                    return response.json();

                }

            } );

    }

    //cache items in IDB to keep data as close as possible to the glass
    function getLocalItems( options, ITEM_KEY ) {

        var dt = new Date();

        return localforage.getItem( ITEM_KEY + _STALE_KEY )
            .then( function ( expires ) {

                if ( expires >= dt ) {

                    return localforage.getItem( ITEM_KEY );

                } else {

                    return localforage.removeItem( ITEM_KEY )
                        .then( function () {
                            return localforage.removeItem( ITEM_KEY + _STALE_KEY );
                        } );

                }

            } );

    }

    function saveLocalItems( items, ITEM_KEY, expires ) {

        expires = expires || MAX_LIST_CACHE;

        return localforage.setItem( ITEM_KEY, items )
            .then( function () {

                var dt = new Date();

                dt.setMinutes( dt.getMinutes() + expires );

                return localforage
                    .setItem( ITEM_KEY + _STALE_KEY, dt );

            } )
            .then( function () {
                return items;
            } );
    }

    //standard crud patterns & routines
    gvtc.data = {

        getItem: getItem,

        getItems: getItems,

        updateItem: updateItem,

        deleteItem: deleteItem,

        getLocalItems: getLocalItems,

        saveLocalItems: saveLocalItems

    };

}() );