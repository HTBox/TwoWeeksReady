( function () {

    "use strict";

    window.gvtc = window.gvtc || {};

    var self = gvtc.component,
        qs;

    var given_name = "[name='given_name']",
        family_name = "[name='family_name']",
        user_email = "[name='user_email']",
        user_password = "[name='user_password']",
        PasswordConfirm = "[name='PasswordConfirm']",
        username = "[name=username]";

    function initialize() {

        //        qs = gvtc.queryStringtoJSON();

        bindEvents();

    }

    function bindEvents() {

        self.on( ".btn-save-registration", "click", registerUser );
        self.on( ".btn-verification-submit", "click", function ( e ) {

            e.preventDefault();

            location.href = "login/confirm/?username=" + self.qs( username ).value;

            return false;

        } );

        self.on( given_name, "keyup", validateContact );
        self.on( family_name, "keyup", validateContact );
        self.on( user_email, "keyup", validateContact );
        self.on( username, "keyup", validateContact );

        self.on( username, "blur", validateContact );

        self.on( given_name, "blur", validateContact );
        self.on( family_name, "blur", validateContact );
        self.on( user_email, "blur", validateContact );

        self.on( user_password, "keyup", validateContact );
        self.on( user_password, "blur", validateContact );
        self.on( PasswordConfirm, "keyup", validateContact );
        self.on( PasswordConfirm, "blur", validateContact );

    }



    function registerUser( e ) {

        e.preventDefault();

        submitNewUser()
            .then( function ( user ) {

                console.log( user );

                location.href = "/";

            } );

        return false;

    }

    function validateContact( e ) {

        e.preventDefault();

        var $firstName = self.qs( given_name ),
            $lastName = self.qs( family_name ),
            $email = self.qs( user_email ),
            $userPassword = self.qs( user_password ),
            $confirmPassword = self.qs( PasswordConfirm ),
            $btRegistration = self.qs( ".btn-save-registration" );

        self.toggleDisabled( $btRegistration, ( ( $firstName.value === "" ||
                $lastName.value === "" ||
                $email.value === "" ) || !$email.validity.valid ||
            ( $userPassword.value !== $confirmPassword.value ) ) );

        return false;

    }

    function submitNewUser() {

        var $firstName = self.qs( given_name ),
            $lastName = self.qs( family_name ),
            $username = self.qs( username ),
            $email = self.qs( user_email ),
            $password = self.qs( user_password );

        return gvtc.auth.createUser( {
                "email": $email.value,
                "username": $username.value,
                "password": $password.value,
                "given_name": $firstName.value,
                "family_name": $lastName.value,
                "groups": [ "cognito:Customer" ]
            } )
            .then( function ( user ) {

                console.log( user );

                location.href = "/";
            } )
            .catch( function ( err ) {
                console.log( err );
            } );

    }

    function toggleVerification() {

        var $modalBG = self.qs( ".modal-background" ),
            $verificationModal = self.qs( ".modal-registration-confirm" );

        $modalBG.classList.toggle( "show" );
        $verificationModal.classList.toggle( "show" );

    }

    initialize();

} )();