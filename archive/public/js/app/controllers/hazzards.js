( function () {

    "use strict";

    var profile,
        helpers = love2dev.component,
        tableTarget = ".family-list",
        $target = helpers.qs( tableTarget ),
        family;


    // function initialize() {

    //     love2dev.app.notAuthCallback( function () {

    //         admin.goToLogin();

    //     } );

    //     love2dev.app.authCallback( loadPage );

    // }

    function initialize() {

        loadPage();

    }


    function loadPage() {

        bindEvents();

    }

    function bindEvents() {



    }

    initialize();

} )();