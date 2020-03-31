( function () {

    "use strict";

    window.gvtc = window.gvtc || {};

    var self = window.gvtc.component;


    function initialize() {

        requestAnimationFrame( function () {

            if ( window.pageLoaded ) {

                if ( !window.authorized ) {

                    location.href = "login/";

                } else {

                    //verify logged in
                    getSummary();

                    bindEvents();

                }

            } else {
                initialize();
            }

        } );

    }

    function bindEvents() {



    }

    function getSummary() {

        gvtc.user_data.getUserProfileData()
            .then( function ( data ) {

                return {
                    "statement": data.Data.Statements[ 0 ]
                };

            } ).then( function ( data ) {

                return self.fetchAndRenderTemplate(
                    "src/templates/summary.html ", data.statement );

            } )
            .then( function ( html ) {

                var target = self.qs( ".main-content" );

                target.innerHTML = html;

            } );

    }


    initialize();

} )();