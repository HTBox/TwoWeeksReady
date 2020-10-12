( function () {

    "use strict";

    var profile;

    var $profileNavBtn = $( ".btn-user-profile" ),
        $logoutNavBtn = $( ".btn-mobile-logout" ),
        $loginNavBtn = $( ".btn-mobile-login" ),
        $signupNavBtn = $( ".mobile-signup-btn" ),
        $logoutBtn = $( ".btn-user-logout" ),
        $btnLogin = $( ".btn-user-login" ),
        $btnSettings = $( ".btn-settings" );

    function initialize() {

        love2dev.app.notAuthCallback( notAuthorizedHandler );
        love2dev.app.authCallback( authorizedHandler );

    }

    function toggleNoneFlex( $ele, state ) {

        if ( $ele ) {
            if ( state ) {
                $ele.removeClass( love2dev.cssClasses.dNone );
                $ele.addClass( love2dev.cssClasses.dFlex );

            } else {
                $ele.addClass( love2dev.cssClasses.dNone );
                $ele.removeClass( love2dev.cssClasses.dFlex );

            }
        }
    }

    function notAuthorizedHandler() {

        toggleNoneFlex( $btnLogin, true );
        toggleNoneFlex( $loginNavBtn, true );
        toggleNoneFlex( $signupNavBtn, true );
        toggleNoneFlex( $logoutNavBtn, false );

    }

    function authorizedHandler() {

        return fetchUser()
            .then( parseUserGroups )
            .then( function () {

                toggleNoneFlex( $profileNavBtn, true );
                toggleNoneFlex( $logoutNavBtn, true );
                toggleNoneFlex( $btnLogin, false );
                toggleNoneFlex( $logoutBtn, true );
                toggleNoneFlex( $btnSettings, true );
                toggleNoneFlex( $loginNavBtn, false );

                renderProfile();
                bindEvents();

            } );

    }

    function setProfileLinks( target ) {
        var $profileLinks = $( ".profile-link" );

        for ( let index = 0; index < $profileLinks.length; index++ ) {

            $profileLinks[ index ].href = target;

        }

    }

    function parseUserGroups() {

        return love2dev.auth.getCognitoGroups()
            .then( function ( groups ) {

                if ( groups && groups.length ) {

                    setProfileLinks( "profile/" );

                }

            } );

    }

    function fetchUser() {

        return love2dev.user.getProfile()
            .then( function ( user ) {

                profile = user;

            } )
            .catch( function ( err ) {

                console.error( err );

            } );

    }

    function renderProfile() {

        var $userName = $( ".user-name" );

        if ( $userName && $userName.length > 0 ) {

            $userName[ 0 ].innerText = profile.first_name + " " + profile.last_name;

        }

    }

    function bindEvents() {

        $( ".btn-signout" ).on( love2dev.events.click, signOut );

        $( ".profile-wrapper .dropdown-toggle" ).on( love2dev.events.click, toggleProfileMenu );

    }

    function toggleProfileMenu( e ) {

        e.preventDefault();

        $( ".profile-wrapper .dropdown-menu" ).toggleClass( love2dev.cssClasses.show );

        return false;

    }

    function signOut( e ) {

        e.preventDefault();

        love2dev.auth.signOut()
            .then( function () {
                location.href = "/";
            } );

        return false;
    }

    initialize();

} )();