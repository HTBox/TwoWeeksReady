( function () {

    "use strict";

    var config = {
        selector: ".primary-alert",
        msgSelector: ".primary-alert",
        timeout: 10000,
        hide: "d-none",
        show: "d-flex",
        alertType: "info"
    };

    var $alert;

    function showAlert( options ) {

        if ( !options.msg ) {
            return;
        }

        options = Object.assign( {}, config, options );

        $alert = document.querySelector( options.selector );

        if ( $alert ) {

            $alert.innerText = options.msg;

            $alert.classList.toggle( options.hide );
            $alert.classList.toggle( options.show );

            for ( var index = 0; index < $alert.classList.length; index++ ) {

                if ( $alert.classList[ index ].indexOf( "alert-" ) > -1 ) {
                    $alert.classList.remove( $alert.classList[ index ] );
                }

            }

            $alert.classList.add( "alert-" + options.alertType );

            setTimeout( function () {
                hideAlert( options );
            }, options.timeout );
        }

    }

    function hideAlert( options ) {

        options = Object.assign( {}, config, options );

        if ( $alert ) {
            $alert.classList.toggle( options.hide );
            $alert.classList.toggle( options.show );
        }
    }

    window.alert_banner = {
        showAlert: showAlert,
        hideAlert: hideAlert
    };

}() );