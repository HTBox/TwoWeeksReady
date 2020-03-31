( function () {

    "use strict";

    window.gvtc = window.gvtc || {};

    var self = window.gvtc.component;

    var username;

    var $username = self.qs( "[name='Username']" );

    function initialize() {

        // get username from queryString
        var qs = gvtc.queryStringtoJSON();

        if ( qs && qs.username ) {

            username = qs.username;

            showConfirmation();

        }

        bindEvents();

    }

    function bindEvents() {

        $username.addEventListener( "keyup", toggleEnable );
        $username.addEventListener( "blur", toggleEnable );

        self.toggleDisabled( ".btn-confirm-account", false );

        self.on( ".btn-confirm-account", "click", handleConfirmation );

        self.on( ".btn-resend-code", "click", resendCode );

    }

    function showConfirmation() {

        $username.value = username;

    }

    function toggleEnable( e ) {

        e.preventDefault();

        var btn = self.qs( ".btn-confirm-account" );

        btn.disabled = e.target.value === "";

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
            $confirmationCode = self.qs( "[name='ConfirmationCode']" );

        if ( $username.checkValidity() && $confirmationCode.checkValidity() ) {

            gvtc.auth.confirmRegistration( {
                "username": $username.value,
                "confirmationCode": $confirmationCode.value
            } );

        } else {
            //display error response
            console.log( "broken" );
        }

        return false;
    }

    initialize();

} )();