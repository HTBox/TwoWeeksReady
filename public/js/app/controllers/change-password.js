( function () {

    "use strict";

    window.love2dev = window.love2dev || {};

    var self = window.love2dev.component;

    function initialize() {

        bindEvents();

    }

    function bindEvents() {

        self.on( ".loginform", love2dev.events.submit, handleLogin, false );

    }

    function handleLogin( e ) {

        e.preventDefault();

        var $username = self.qs( "[name='Username']" ),
            $password = self.qs( "[name='Password']" );

        loginUser( $username.value, $password.value );

        return false;
    }

    function handleRejection( reject ) {

        if ( reject.__type ) {

            if ( reject.__type === "UserNotFoundException" ) {

            } else if ( reject.ChallengeName ) {


            }

        }

    }

    function loginUser( username, password ) {

        return love2dev.auth.loginUser( username, password )
            .then( function ( token ) {

                return love2dev.auth
                    .setUserAttributes( token )
                    .then( function () {
                        return token;
                    } );

            } )
            .then( function ( token ) {

                return love2dev.auth
                    .setCognitoGroups( token[ cognitoGroups ] );

            } )
            .then( function () {

                return love2dev.auth.getUserData( true );

            } )
            .then( function () {

                location.href = "profile/";

            } )
            .catch( handleRejection );

    }

    initialize();

} )();