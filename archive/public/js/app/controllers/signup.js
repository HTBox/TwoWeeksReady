( function () {

    "use strict";

    window.love2dev = window.love2dev || {};

    var self = love2dev.component;

    var given_name = "[name='given_name']",
        family_name = "[name='family_name']",
        user_email = "[name='user_email']",
        user_password = "[name='user_password']",
        // PasswordConfirm = "[name='PasswordConfirm']",
        username = "[name='username']";

    var $firstName = $( given_name ),
        $lastName = $( family_name ),
        $username = $( username ),
        $email = $( user_email ),
        $password = $( user_password ),
        //$confirmPassword = $( PasswordConfirm ),
        $btRegistration = $( ".btn-save-registration" ),
        $errorFeedbackRow = self.qs( ".invalid-feedback" ),
        $errMsg = $( ".error_message" );


    function initialize() {

        love2dev.app.authCallback( function () {

            location.href = "/";

        } );

        love2dev.app.notAuthCallback( function () {

            bindEvents();

        } );

    }

    function bindEvents() {

        $btRegistration.on( love2dev.events.click, registerUser );

        $( ".btn-verification-submit" ).on( love2dev.events.click, function ( e ) {

            e.preventDefault();

            location.href = "login/confirm/?username=" + $username.value();

            return false;

        } );

        $( ".registration-container input, .registration-container textarea, .registration-container select" )
            .on( [ "blur", "change", "keyup" ], validateForm );

    }

    function validateForm( e ) {

        e.preventDefault();

        validate();

        return false;
    }

    function isValidPassword() {
        let valid = /(?=.*[A-Z])(?=.*[!@#<%body%>*])(?=.*[0-9])(?=.*[a-z]).{8}/.test( $password.value() );
        // &&
        // $password.value() === $confirmPassword.value();

        return valid;
    }

    function validate() {

        var $fields = document.querySelectorAll( ".registration-container input, .registration-container textarea, .registration-container select" );

        var isValid = true;

        for ( var index = 0; index < $fields.length; index++ ) {

            if ( !$fields[ index ].validity.valid ) {
                isValid = false;
                $fields[ index ].classList.add( "invalid" );
                $fields[ index ].classList.remove( "valid" );
            } else {
                $fields[ index ].classList.add( "valid" );
                $fields[ index ].classList.remove( "invalid" );
            }

        }

        if ( !isValidPassword( $password.value() ) ) {
            isValid = false;
            $password.addClass( "invalid" );
            $password.removeClass( "valid" );
        } else {
            $password.removeClass( "invalid" );
            $password.addClass( "valid" );
        }

        self.toggleDisabled( "[name='btn-save-registration']", !isValid );

    }

    function registerUser( e ) {

        e.preventDefault();

        submitNewUser();

        return false;

    }

    function getUser() {
        return {
            "email": $email.value(),
            "username": $username.value(),
            "password": $password.value(),
            "given_name": $firstName.value(),
            "family_name": $lastName.value(),
            "groups": [ "cognito:Customer" ]
        };

    }

    function isValidUsername() {
        return ( $username.value().length > 7 &&
            /^\S+$/.test( $username.value() ) );

    }

    function submitNewUser() {

        var _user = getUser();

        if ( !isValidUsername() ) {

            showFormError( "Username must be at least 8 characters" );

            return;
        }

        love2dev.auth.createUser( _user )
            .then( function ( user ) {

                toggleVerification();

            } )
            .catch( function ( err ) {

                showFormError( err.message.message );

            } );

    }

    function showFormError( message ) {

        if ( message && message !== "" ) {

            $errMsg.text( message );
            $errorFeedbackRow.classList.add( love2dev.cssClasses.dFlex );
            $errorFeedbackRow.classList.remove( love2dev.cssClasses.dNone );

            window.scrollTo( {
                top: 0,
                left: 0,
                behavior: "smooth"
            } );

        } else {

            $errMsg.text( "" );
            $errorFeedbackRow.classList.remove( love2dev.cssClasses.dFlex );
            $errorFeedbackRow.classList.add( love2dev.cssClasses.dNone );

        }

    }

    function toggleVerification() {

        var $modalBG = $( ".modal-bg" ),
            $verificationModal = $( ".modal-registration-confirm" );

        $modalBG.toggleClass( love2dev.cssClasses.show );
        $verificationModal.toggleClass( love2dev.cssClasses.show );

    }

    initialize();

} )();