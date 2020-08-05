( function () {

    "use strict";

    var profile,
        helpers = love2dev.component,
        tableTarget = ".family-list",
        $target = helpers.qs( tableTarget ),
        family;


    function initialize() {

        love2dev.app.notAuthCallback( function () {

            love2dev.app.goToLogin();

        } );

        love2dev.app.authCallback( loadPage );

    }

    function loadPage() {

        bindEvents();

    }

    function bindEvents() {



    }




    initialize();

} )();