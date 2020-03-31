( function () {

    "use strict";

    var self = mehab.component;

    mehab.utils.nameSpace( "mehab.snackbar" );


    function showSnackbar( msg ) {

        var confirmSnack = self.qs( ".snackbar-confirm" ),
            confirmLabel = self.qs( ".mdc-snackbar__label" );

        if ( confirmSnack ) {

            confirmLabel.innerText = msg;

            //mdc-snackbar--open
            confirmSnack.classList.toggle( "mdc-snackbar--open" );
            confirmSnack.classList.toggle( "fadeIn" );
            confirmSnack.classList.toggle( "fadeOut" );

            setTimeout( function () {
                confirmSnack.classList.toggle( "fadeOut" );
                confirmSnack.classList.toggle( "fadeIn" );
            }, 5000 );

            setTimeout( function () {
                confirmSnack.classList.toggle( "mdc-snackbar--open" );
            }, 6000 );

        }

    }

    function bindEvents() {

        return;
    }

    function displayErrorMessage( msg ) {}


    mehab.snackbar = {
        displayErrorMessage: displayErrorMessage,
        showSnackbar: showSnackbar
    };

} )();