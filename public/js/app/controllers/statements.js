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
                    getStatements()
                        .then( bindEvents );

                }

            } else {
                initialize();
            }

        } );

    }

    function bindEvents() {



    }

    function getStatements() {

        return gvtc.user_data.getUserProfileData()
            .then( function ( data ) {

                return data.Data;

            } ).then( function ( data ) {

                return self.fetchAndRenderTemplate(
                    "src/templates/statement-list.html ", data );

            } )
            .then( function ( html ) {

                var target = self.qs( ".main-content" );

                target.innerHTML = html;

            } );

    }



    initialize();

} )();