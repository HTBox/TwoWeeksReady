( function () {

    "use strict";

    window.love2dev = window.love2dev || {};

    var self = window.love2dev.component;

    var username;

    var $confirmMsg = self.qs( ".feedback-message" ),
        $confirmMsgP = self.qs( ".feedback-message p" );

    var $username = self.qs( "[name='Username']" );

    function initialize() {

        // get username from queryString
        var qs = self.queryStringtoJSON();

        if ( qs && qs.username ) {

            username = qs.username;

            showConfirmation();

        }

        bindEvents();

    }

    function bindEvents() {

        $username.addEventListener( love2dev.events.keyup, toggleEnable );
        $username.addEventListener( love2dev.events.blur, toggleEnable );

        self.toggleDisabled( ".btn-confirm-account", false );

        self.on( ".btn-confirm-account", love2dev.events.click, handleConfirmation );
        self.on( ".btn-resend-code", love2dev.events.click, resendCode );
        self.on( ".btn-verification-submit", love2dev.events.click, acknowledgeConfirm );

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

            love2dev.auth.resendConfirmationCode( {
                    "username": $username.value
                } )
                .then( function ( msg ) {

                    var $confirmMsg = self.qs( ".feedback-message" ),
                        $confirmMsgP = self.qs( ".feedback-message p" );

                    $confirmMsgP.classList.remove( "text-danger" );

                    $confirmMsg.classList.add( "show" );

                    if ( msg.__type ) { //error

                        $confirmMsgP.innerText = msg.message;
                        $confirmMsgP.classList.add( "text-danger" );

                    } else {

                        $confirmMsgP.innerText = "A new confirmation code has been sent to your e-mail address: " + msg.CodeDeliveryDetails.Destination;

                    }

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

            love2dev.auth.confirmRegistration( {
                    "username": $username.value,
                    "confirmationCode": $confirmationCode.value
                } )
                .then( function ( msg ) {

                    if ( msg.status > 300 ) { //error

                        $confirmMsg.classList.add( "show" );
                        $confirmMsgP.innerText = msg.message;
                        $confirmMsgP.classList.add( "text-danger" );

                    } else {

                        showConfirmationPanel();

                    }

                } );

        } else {
            //display error response
            console.log( "broken" );
            $confirmMsg.classList.add( "show" );
            $confirmMsgP.innerText = "network connection error, you may be offline";
            $confirmMsgP.classList.add( "text-danger" );

        }

        return false;
    }

    function showConfirmationPanel() {

        var $confirmPnl = self.qs( ".confirmation-panel" ),
            $confirmForm = self.qs( ".confirmation-form" );

        $confirmPnl.classList.add( love2dev.cssClasses.dFlex );
        $confirmPnl.classList.remove( love2dev.cssClasses.dNone );

        $confirmForm.classList.remove( love2dev.cssClasses.dFlex );
        $confirmForm.classList.add( love2dev.cssClasses.dNone );

    }

    function acknowledgeConfirm() {
        love2dev.app.goToLogin();
    }

    initialize();

} )();