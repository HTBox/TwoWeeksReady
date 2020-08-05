( function () {

    "use strict";

    window.love2dev = window.love2dev || {};

    var self = window.love2dev.component;

    var username,
        $errorMessage = self.qs( ".error_message" ),
        $errorWrapper = self.qs( ".login-form-error" );

    function initialize() {

        // get username from queryString
        var qs = self.queryStringtoJSON();

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

        $username.addEventListener( love2dev.events.keyup, toggleEnable );
        $username.addEventListener( love2dev.events.blur, toggleEnable );
        $password.addEventListener( love2dev.events.keyup, toggleEnable );
        $password.addEventListener( love2dev.events.blur, toggleEnable );
        $ConfirmationCode.addEventListener( love2dev.events.keyup, toggleEnable );
        $ConfirmationCode.addEventListener( love2dev.events.blur, toggleEnable );

        self.on( "[name='btn-update-password']", love2dev.events.click, handleConfirmation );

        self.on( ".btn-resend-code", love2dev.events.click, resendCode );

        self.on( ".btn-verification-submit", love2dev.events.click, acknowledgeConfirm );

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

            love2dev.auth.recoverPassword( {
                    "username": $username.value
                } )
                .then( function ( msg ) {

                    $errorMessage.classList.remove( "text-danger" );

                    $errorWrapper.classList.remove( love2dev.cssClasses.dNone );

                    if ( msg.__type ) { //error

                        $errorMessage.innerText = msg.message;
                        $errorMessage.classList.add( "text-danger" );

                    } else {

                        $errorMessage.innerText =
                            "A new confirmation code has been sent to your e-mail address: " +
                            msg.CodeDeliveryDetails.Destination;

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
            $password = self.qs( "[name='Password']" ),
            $confirmationCode = self.qs( "[name='ConfirmationCode']" );

        if ( $username.checkValidity() &&
            $confirmationCode.checkValidity() &&
            $password.checkValidity() ) {

            love2dev.auth.confirmPassword( {
                    "username": $username.value,
                    "newPassword": $password.value,
                    "confirmationCode": $confirmationCode.value
                } )
                .then( function ( response ) {

                    if ( response.status > 300 ) {

                        showError( response.message );

                    } else {

                        //love2dev.app.goToLogin();
                        showConfirmationPanel();

                    }

                } )
                .catch( function ( err ) {
                    console.log( err );

                    showError( "network connection error, you may be offline" );

                } );

        } else {
            //display error response
            console.log( "broken" );
        }

        return false;
    }

    function showError( message ) {
        $errorWrapper.classList.remove( love2dev.cssClasses.dNone );

        $errorMessage.classList.add( "text-danger" );

        $errorMessage.innerHTML = message;
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