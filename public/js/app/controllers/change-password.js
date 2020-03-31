( function () {

    "use strict";

    window.gvtc = window.gvtc || {};

    var self = window.gvtc.component;

    var cognitoGroups = "cognito:groups";

    function initialize() {

        bindEvents();

    }

    function bindEvents() {

        self.on( ".loginform", gvtc.events.submit, handlePasswordChange, false );

    }

    function handlePasswordChange( e ) {

        e.preventDefault();

        var $oldPassword = self.qs( "[name='oldPassword']" ),
            $password = self.qs( "[name='Password']" ),
            $ConfirmPassword = self.qs( "[name='ConfirmPassword']" );

        if ( $ConfirmPassword.value === $password.value ) {

            return gvtc.auth.changePassword( $oldPassword.value, $password.value )
                .then( handleResponse )
                .catch( handleRejection );

        } else {

            displayError( "Sorry, your new password does not match. Reenter it and confirm it again." );
        }

    }

    function handleRejection( reject ) {

        displayError( "Sorry your request could not be processed. Possibly because a connection to the server could not be established. Make sure you have a connection and try again later." );
    }

    function displaySuccess() {

        var $success = self.qs( ".action-confirmation" ),
            $form = self.qs( ".loginform" );

        $form.classList.add( "d-none" );

        $success.classList.remove( "d-none" );
        $success.classList.add( "d-flex" );
    }

    function displayError( msg ) {

        var $errorMessage = self.qs( ".error-message" ),
            $messageTxt = self.qs( ".error-message-text" );

        $messageTxt.innerHTML = msg;

        $errorMessage.classList.remove( "d-none" );

    }

    function handleResponse( response ) {

        var errorMessage = "";

        switch ( response.status ) {

            case 200:

                displaySuccess();

                break;

            case 400:
            case 500:

                displayError( "There is a problem with your password. Please check them to make sure your old password is correct and you entered a valid new password." );

                break;

            default:
                break;
        }
    }

    initialize();

} )();