( function () {

    "use strict";

    //Constants here

    var profile,
        USER_KEY = "user-profile-",
        USER = "/user",
        Key = "key-user",
        recordLifeSpan = 60 * 15; //1 hour

    function clearUserCache( id ) {

        return localforage.removeItem( USER_KEY + id );
    }

    function getUser( options ) {

        return love2dev.http.authorized( {
                "method": "GET",
                "mode": "cors",
                "url": "https://ks09vmmyw1.execute-api.us-east-1.amazonaws.com/development/" + USER + "?id=" + options.id
            } )
            .then( function ( response ) {

                if ( response.ok ) {

                    return response.json();

                }

            } );
    }

    function getUserByUsername( options ) {

        if ( !options.username ) {

            return Promise.reject( "no valid user selection criteria supplied" );

        }

        return love2dev.data.getItem( options,
                "https://ks09vmmyw1.execute-api.us-east-1.amazonaws.com/development/" + USER + "?username=" + options.username,
                USER_KEY + options.username )
            .then( function ( user ) {

                if ( user.length ) {
                    user = user[ 0 ];

                    return love2dev.data.saveLocalItems( user, USER_KEY + options.username )
                        .then( function () {
                            return user;
                        } );
                }

                return user;

            } );

    }

    function createUser( user ) {

        return updateUser( user );

    }

    function updateUser( user ) {

        return love2dev.http.post( "https://ks09vmmyw1.execute-api.us-east-1.amazonaws.com/development/" + USER, {
                "method": "POST",
                "mode": "cors",
                "authorized": true,
                "body": JSON.stringify( user )
            } )
            .then( function ( response ) {

                if ( response.ok ) {

                    return purgeCachedUser( user )
                        .then( function () {

                            return response.json();

                        } );

                } else {
                    return response.json();
                }

            } );

    }

    function getUsers( options ) {

        /*
        if ( !options || !options.tennantId || !options.siteId ) {
            return Promise.reject( "invalid fetch options provided: ", options );
        }
        */

        //options.limitAttributes = options.limitAttributes || true;
        //options.limit = 1000;

        return love2dev.http.cacheAndFetch( {
                key: Key,
                url: "https://ks09vmmyw1.execute-api.us-east-1.amazonaws.com/development/" + USER,
                ttl: recordLifeSpan
            } )
            .then( response => {

                return response;
            } );

    }

    function deleteUser( options ) {

        return love2dev.http.authorized( {
                "method": "DELETE",
                "mode": "cors",
                "url": "https://ks09vmmyw1.execute-api.us-east-1.amazonaws.com/development/" + USER + "?id=" + options.id
            } )
            .then( function ( response ) {

                if ( response.ok ) {

                    return response.json();

                }

            } );
    }

    function getProfile() {

        if ( !window.authorized ) {
            return Promise.resolve();
        }

        if ( profile ) {
            return Promise.resolve( profile );
        }

        //        if ( attributes && attributes[ "cognito:username" ] ) {

        return love2dev.auth.getUserAttributes()
            .then( function ( attributes ) {

                return getUserByUsername( {
                    "username": attributes[ "cognito:username" ]
                } );

            } )
            .then( p => {

                profile = p;

                return profile;

            } );

        //     }

    }

    function purgeCachedUser( user ) {

        return localforage.removeItem( USER_KEY + user.username )
            .then( function () {
                return localforage.removeItem( USER_KEY + user.username + "-expires" );
            } )
            .then( function () {
                return localforage.removeItem( USER_KEY + user.assetId );
            } )
            .then( function () {
                return localforage.removeItem( USER_KEY + user.assetId + "-expires" );
            } )
            .then( function () {

                profile = undefined;

            } );

    }

    window.love2dev = window.love2dev || {};

    window.love2dev.user = {
        getProfile: getProfile,
        getUserByUsername: getUserByUsername,
        clearUserCache: clearUserCache,
        createUser: createUser,
        getUser: getUser,
        getUsers: getUsers,
        updateUser: updateUser,
        deleteUser: deleteUser
    };

} )();