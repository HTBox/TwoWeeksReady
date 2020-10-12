( function () {

    "use strict";

    window.love2dev = window.love2dev || {};

    var self = window.love2dev.component;

    var cognitoGroups = "cognito:groups",
        cognitoChallenge;

    var $username = self.qs( "[name='Username']" ),
        $password = self.qs( "[name='Password']" ),
        $loginSubmit = self.qs( "[name='btn_login']" ),
        $given_name = self.qs( "[name='given_name']" ),
        $family_name = self.qs( "[name='family_name']" ),
        $new_password = self.qs( "[name='new_password']" ),
        $confirm_new_password = self.qs( "[name='confirm_new_assword']" ),
        $newPasswordSubmit = self.qs( ".btn-new_password-submit" );

    function initialize() {

        love2dev.app.authCallback( function () {

            window.location.href = "/";

        } );

        love2dev.app.notAuthCallback( bindEvents );

    }

    function bindEvents() {

        self.on( ".loginform", love2dev.events.submit, handleLogin, false );

        self.on( ".btn-challenge-change-password", love2dev.events.click, handleChallengePasswordChange, false );

        self.on( ".loginform input", love2dev.events.keyup, validateLoginForm );
        self.on( ".loginform input", love2dev.events.blur, validateLoginForm );

        self.on( ".modal-new-password-challenge input", love2dev.events.keyup, validatePasswordChallengeForm );
        self.on( ".modal-new-password-challenge input", love2dev.events.blur, validatePasswordChallengeForm );

        self.on( ".btn-new_password-submit", love2dev.events.click, handleChallengePasswordChange );

        self.on( ".btn-cancel",
            love2dev.events.click,
            function ( e ) {

                e.preventDefault();

                history.back();

                return false;

            } );

    }

    function validateLoginForm( e ) {

        e.preventDefault();

        if ( $username.value !== "" && $password.value !== "" ) {

            $loginSubmit.disabled = false;
            $loginSubmit.setAttribute( "aria-disabled", false );

        }

        return false;

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

            var $loginFormError = self.qs( ".login-form-error" ),
                $loginFormErrorMessage = self.qs( ".login-form-error .error_message" );

            $loginFormErrorMessage.innerHTML = reject.message;

            $loginFormError.classList.add( dFlex );
            $loginFormError.classList.remove( dNone );

        } else if ( reject.ChallengeName ) {

            handleChallenge( reject );

        }

    }

    function loginUser( username, password ) {

        return love2dev.auth.loginUser( username, password )
            .then( function ( token ) {

                return love2dev.auth
                    .setUserAttributes( token )
                    .then( function () {
                        return token;
                    } )
                    .catch( handleRejection );

            } )
            .then( function ( token ) {

                return love2dev.auth
                    .setCognitoGroups( token[ cognitoGroups ] );

            } )
            .then( function () {

                return love2dev.auth.getUserData( true );

            } )
            .then( function () {

                location.href = "/";

            } )
            .catch( handleRejection );

    }

    function validatePasswordChallengeForm( e ) {

        e.preventDefault();

        if ( $new_password.value !== "" && $confirm_new_password.value !== "" &&
            $new_password.value === $confirm_new_password.value ) {

            $newPasswordSubmit.disabled = false;
            $newPasswordSubmit.setAttribute( "aria-disabled", false );

        }

        return false;

    }

    function toggleChallengeModal() {

        self.qs( ".challenge-background" ).classList.toggle( "show" );
        self.qs( ".modal-new-password-challenge" ).classList.toggle( "show" );

    }


    function handleChallenge( challenge ) {

        cognitoChallenge = challenge;

        switch ( challenge.ChallengeName ) {
            case "NEW_PASSWORD_REQUIRED":

                toggleChallengeModal();

                break;

            default:

                notImplementedHandler( challenge );
                break;
        }


        //NEW_PASSWORD_REQUIRED
        //DEVICE_PASSWORD_VERIFIER
        //DEVICE_SRP_AUTH
        //CUSTOM_CHALLENGE
        //PASSWORD_VERIFIER
        //SMS_MFA

    }

    function notImplementedHandler( challenge ) {

        console.log( challenge.ChallengeName + " not implemented yet" );

    }

    function handleChallengePasswordChange( e ) {

        e.preventDefault();

        var requiredValues = {
            "given_name": $given_name.value,
            "family_name": $family_name.value
        };

        if ( $new_password.value === $confirm_new_password.value ) {

            //submit
            love2dev.auth
                .completeNewPasswordChallenge( $new_password.value,
                    cognitoChallenge, requiredValues )
                .then( function ( result ) {

                    location.href = "/";
                } )
                .catch( function ( err ) {
                    console.error( err );
                } );

        } else {
            //display mismatched password message
        }

        return false;

    }

    initialize();

} )();