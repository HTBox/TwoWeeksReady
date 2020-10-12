( function () {

    "use strict";

    var apiURL = "https://rj6n0jgrvg.execute-api.us-east-1.amazonaws.com/dev/";

    var USER_PROFILE = "-user-profile",
        FAMILY_KEY = "current-family",
        FAMILY_MEMBER_KEY = "family-member",
        cacheLifeSpan = 15 * 60;

    //PROFILE
    function getProfile( options ) {

        if ( !options && ( !options.id ) ) {

            return Promise.reject( "no valid message selection criteria supplied" );

        }

        return getUserProfileData( options )
            .then( function ( user_data ) {

                return user_data.Profile;

            } );

    }

    /* update the profile */
    function postProfile( profile ) {

        if ( !profile ) {
            return Promise.reject( "no profile object supplied" );
        }

        profile.date_updated = new Date().toISOString();

        profile.assetType = "message";

        // return gvtc.http.authorized( {
        //         "method": "POST",
        //         "mode": "cors",
        //         "url": gvtc.apiURLBase + apiURL + "?tennantId=" + employee.tennantId,
        //         "body": JSON.stringify( employee )
        //     } )
        //     .then( function ( response ) {

        //         if ( response.ok ) {

        //             return response.json();

        //         }

        //         //could postMessage to service worker to update cached list here
        //     } )
        //     .then( function () {

        //         return getMessage( {
        //             "forceUpdate": true,
        //             "tennantId": employee.tennantId
        //         } );
        //     } );

        return Promise.resolve();

    }

    function getUserProfileData() {

        return gvtc.data
            .getItems( {}, "api/" + apiURL, USER_PROFILE );

    }

    function deleteFamily( options ) {

        if ( options.id ) {

            return fetch( apiURL + "family?id=" + options.id, {
                    "mode": "cors",
                    "method": "DELETE"
                } )
                .then( function ( response ) {

                    if ( response.ok ) {

                        return response.json();

                    }

                } )
                .then( function ( response ) {

                    return getFamilies();

                } );

        } else {

            return Promise.reject( "missing Patient Id" );

        }

    }

    function updateFamily( family ) {

        return love2dev.http.post( {
                url: apiURL + "family",
                body: JSON.stringify( family )
            } )
            .then( function ( response ) {

                return response;

            } );

    }

    function getFamily( options ) {

        if ( !options || !options.id ) {
            return Promise.reject( "invalid fetch options provided: ", options );
        }

        var key = FAMILY_KEY + "-" + options.id;

        return love2dev.http.cacheAndFetch( {
                key: key,
                url: apiURL + "family?id=" + options.id,
                ttl: cacheLifeSpan,
                mode: "cors"
            } )
            .then( response => {

                if ( response.length && response.length > 0 ) {

                    var page = response[ 0 ];

                    return localforage.setItem( key, page )
                        .then( function () {
                            return page;
                        } );
                }

                return response;

            } );

    }

    function getFamilies( options ) {

        options.limitAttributes = options.limitAttributes || true;
        options.limit = 1000;

        return love2dev.http.cacheAndFetch( {
            key: FAMILY_KEY,
            url: apiURL + "family",
            ttl: cacheLifeSpan
        } );

    }


    function deleteFamilyMember( options ) {

        if ( options.id ) {

            return fetch( apiURL + "family-member?id=" + options.id, {
                    "mode": "cors",
                    "method": "DELETE"
                } )
                .then( function ( response ) {

                    if ( response.ok ) {

                        return response.json();

                    }

                } )
                .then( function ( response ) {

                    return getFamilies();

                } );

        } else {

            return Promise.reject( "missing Patient Id" );

        }

    }

    function updateFamilyMember( family ) {

        return love2dev.http.post( {
                url: apiURL + "family-member",
                body: JSON.stringify( family )
            } )
            .then( function ( response ) {

                return response;

            } );

    }

    function getFamilyMember( options ) {

        if ( !options || !options.id ) {
            return Promise.reject( "invalid fetch options provided: ", options );
        }

        var key = FAMILY_MEMBER_KEY + "-" + options.id;

        return love2dev.http.cacheAndFetch( {
                key: key,
                url: apiURL + "family-member?id=" + options.id,
                ttl: cacheLifeSpan,
                mode: "cors"
            } )
            .then( response => {

                if ( response.length && response.length > 0 ) {

                    var page = response[ 0 ];

                    return localforage.setItem( key, page )
                        .then( function () {
                            return page;
                        } );
                }

                return response;

            } );

    }

    function getFamilyMembers( options ) {

        options.limitAttributes = options.limitAttributes || true;
        options.limit = 1000;

        return love2dev.http.cacheAndFetch( {
            key: FAMILY_MEMBER_KEY + "-" + options.id,
            url: apiURL + "family-member?id=" + options.id,
            ttl: cacheLifeSpan
        } );

    }

    window.httoolbox = window.httoolbox || {};
    httoolbox.data = {

        getFamilies: getFamilies,
        getFamily: getFamily,
        updateFamily: updateFamily,
        deleteFamily: deleteFamily,

        getFamilyMember: getFamilyMember,
        getFamilyMembers: getFamilyMembers,
        updateFamilyMember: updateFamilyMember,
        deleteFamilyMember: deleteFamilyMember

    };

}() );