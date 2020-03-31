( function () {

    "use strict";

    window.gvtc = window.gvtc || {};

    var self = window.gvtc.component;

    var username = "",
        txtUser = "[name='Username']";

    function initialize() {

        // get username from queryString
        var qs = gvtc.utils.queryStringtoJSON();

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

        $username.addEventListener( gvtc.events.keyup, toggleEnable );
        $username.addEventListener( gvtc.events.blur, toggleEnable );

        self.on( ".btn-forgot-password", gvtc.events.click, handleRequest );
    }

    function toggleEnable( e ) {

        e.preventDefault();

        var btn = self.qs( ".btn-forgot-password" );

        btn.disabled = e.target.value === "";

        btn.setAttribute( "aria-disabled", btn.disabled );

        return false;

    }

    function handleRequest( e ) {

        e.preventDefault();

        var $username = self.qs( "[name='Username']" );

        if ( $username.checkValidity() ) {

            return gvtc.auth.forgotPassword( {
                    "username": $username.value
                } )
                .then( function () {
                    location.href = "login/forgot-password/confirm/";
                } );

        } else {
            //display error response
            console.log( "broken" );
        }

        return false;

    }

    initialize();

} )();