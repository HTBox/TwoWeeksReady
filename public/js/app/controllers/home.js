( function () {

    "use strict";

    var profile,
        helpers = love2dev.component,
        tableTarget = ".family-list",
        $target = helpers.qs( tableTarget ),
        family;


    function initialize() {

        httoolbox.app.notAuthCallback( function () {

            admin.goToLogin();

        } );

        httoolbox.app.authCallback( loadPage );

    }

    function loadPage() {

        bindEvents();

    }

    function bindEvents() {



    }




    initialize();

} )();