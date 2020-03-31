( function () {

    "use strict";

    window.gvtc = window.gvtc || {};

    var self = window.gvtc.component;

    var cognitoGroups = "cognito:groups",
        username = "",
        dFlex = "d-flex",
        dNone = "d-none",
        cognitoChallenge;

    function initialize() {

        gvtc.auth.getIdToken()
            .then( function ( token ) {

                if ( token ) {

                    window.location.href = "/";

                } else {

                    bindEvents();

                }

            } );

    }

    function bindEvents() {

        self.on( ".loginform", gvtc.events.submit, handleLogin, false );

        self.on( ".btn-challenge-change-password", gvtc.events.click, handleChallengePasswordChange, false );

    }

    function handleLogin( e ) {

        e.preventDefault();

        var $username = self.qs( "[name='Username']" ),
            $password = self.qs( "[name='Password']" );

        username = $username.value;

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

        return gvtc.auth.loginUser( username, password )
            .then( function () {

                location.href = "/";

            } )
            .catch( handleRejection );

    }

    function toggleForms( newForm ) {

        var $newForm = self.qs( newForm ),
            $formContainers = self.qsa( ".form-container" );

        for ( var index = 0; index < $formContainers.length; index++ ) {

            $formContainers[ index ].classList.remove( dFlex );
            $formContainers[ index ].classList.add( dNone );

        }

        $newForm.classList.add( dFlex );
        $newForm.classList.remove( dNone );

    }

    function handleChallenge( challenge ) {

        cognitoChallenge = challenge;

        switch ( challenge.ChallengeName ) {
            case "NEW_PASSWORD_REQUIRED":

                toggleForms( ".challenge-change-password-container" );

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

        var $ChallengePassword = self.qs( "[name=ChallengePassword]" ),
            $PasswordConfirm = self.qs( "[name=PasswordConfirm]" ),
            $given_name = self.qs( "[name=given_name]" ),
            $family_name = self.qs( "[name=family_name]" );

        var requiredValues = {
            "given_name": $given_name.value,
            "family_name": $family_name.value
        };

        if ( $PasswordConfirm.value === $ChallengePassword.value ) {

            //submit
            gvtc.auth
                .completeNewPasswordChallenge( $PasswordConfirm.value,
                    cognitoChallenge, requiredValues )
                .then( function ( result ) {

                    console.log( "done" );
                } );

        } else {
            //display mismatched password message
        }

        return false;

    }

    initialize();

} )();