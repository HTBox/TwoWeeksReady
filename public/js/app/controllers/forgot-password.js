( function () {

    "use strict";

    window.love2dev = window.love2dev || {};

    var self = window.love2dev.component;

    var username = "",
        txtUser = "[name='Username']";

    function initialize() {

        // get username from queryString
        var qs = self.queryStringtoJSON();

        if ( qs && qs.username ) {

            username = qs.username;

        }

        setupForm();

    }

    function setupForm() {

        var $username = self.qs( txtUser );

        $username.value = username;

        if ( username && username !== "" ) {

            var btn = self.qs( ".btn-forgot-password" );

            btn.disabled = false;
            btn.setAttribute( "aria-disabled", false );

        }

        $username.addEventListener( love2dev.events.keyup, toggleEnable );
        $username.addEventListener( love2dev.events.blur, toggleEnable );

        self.on( ".btn-forgot-password", love2dev.events.click, handleRequest );
    }

    function toggleEnable( e ) {

        e.preventDefault();

        var btn = self.qs( ".btn-forgot-password" );

        self.toggleDisabled( btn, e.target.value === "" );

        return false;

    }

    function handleRequest( e ) {

        e.preventDefault();

        var $username = self.qs( "[name='Username']" );

        if ( $username.checkValidity() ) {

            return love2dev.auth.forgotPassword(  $username.value )
                .then( function ( response ) {

                    var $confirmMsg = self.qs( ".error-message" );

                    $confirmMsg.classList.remove( "text-danger" );

                    if ( !response.message ) {

                        location.href = "login/forgot-password/confirm/?username=" + username;

                    } else {

                        $errorMessage.innerText = response.message;
                        $confirmMsg.classList.add( "text-danger show" );

                    }

                } );

        } else {
            //display error response
            console.log( "invalid form" );
        }

        return false;

    }

    initialize();

} )();