( function () {

    "use strict";

    //Constants here

    var profile,
        helpers = love2dev.component,
        tableTarget = ".family-list",
        $target = helpers.qs( tableTarget ),
        family;

    function initialize() {

        // admin.notAuthCallback( function () {

        //     admin.goToLogin();

        // } );

        // admin.authCallback( loadPage );

        loadPage();

    }

    function loadPage() {

        httoolbox.data.getFamily( {
                "id": "31982b9c-73ed-427d-8782-310f7285c100"
            } )
            .then( function ( result ) {

                family = result;

            } )
            .then( function () {

                return helpers.fetchAndRenderTemplate( "templates/family.html", family )
                    .then( function ( html ) {

                        $target.innerHTML = html;

                    } );

            } );

    }


    initialize();

} )();