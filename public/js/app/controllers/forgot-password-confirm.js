( function () {

    "use strict";

    window.gvtc = window.gvtc || {};

    var self = window.gvtc.component;

    var username;

    function initialize() {

        // get username from queryString
        var qs = gvtc.utils.queryStringtoJSON();

        if ( qs && qs.username ) {

            username = qs.username;

            showConfirmation();

        }

    }

    function showConfirmation() {

        var $username = self.qs( "[name='Username']" ),
            $password = self.qs( "[name='Password']" ),
            $ConfirmationCode = self.qs( "[name='ConfirmationCode']" );

        $username.value = username;

        $username.addEventListener( gvtc.events.keyup, toggleEnable );
        $username.addEventListener( gvtc.events.blur, toggleEnable );
        $password.addEventListener( gvtc.events.keyup, toggleEnable );
        $password.addEventListener( gvtc.events.blur, toggleEnable );
        $ConfirmationCode.addEventListener( gvtc.events.keyup, toggleEnable );
        $ConfirmationCode.addEventListener( gvtc.events.blur, toggleEnable );

        self.on( "[name='btn-update-password']", gvtc.events.click, handleConfirmation );

        self.on( ".btn-resend-code", gvtc.events.click, resendCode );
    }

    function toggleEnable( e ) {

        e.preventDefault();

        var btn = self.qs( "[name='btn-update-password']" );

        var $username = self.qs( "[name='Username']" ),
            $password = self.qs( "[name='Password']" ),
            $ConfirmationCode = self.qs( "[name='ConfirmationCode']" );

        btn.disabled = ( $username.value === "" ||
            $password.value === "" ||
            $ConfirmationCode.value === "" );

        btn.setAttribute( "aria-disabled", btn.disabled );

        return false;

    }

    function resendCode( e ) {

        e.preventDefault();

        var $username = self.qs( "[name='Username']" );

        if ( $username.checkValidity() ) {

            gvtc.auth.resendConfirmationCode( {
                "username": $username.value
            } );

        } else {
            //display error response
            console.log( "broken" );
        }

        return false;

    }

    function handleConfirmation( e ) {

        e.preventDefault();

        var $username = self.qs( "[name='Username']" ),
            $password = self.qs( "[name='Password']" ),
            $confirmationCode = self.qs( "[name='ConfirmationCode']" );

        if ( $username.checkValidity() &&
            $confirmationCode.checkValidity() &&
            $password.checkValidity() ) {

            gvtc.auth.confirmPassword( {
                    "username": $username.value,
                    "newPassword": $password.value,
                    "confirmationCode": $confirmationCode.value
                } )
                .then( function () {
                    location.href = "login/";
                } );

        } else {
            //display error response
            console.log( "broken" );
        }

        return false;
    }


    initialize();

} )();