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
                    getActivity();

                    bindEvents();

                }

            } else {
                initialize();
            }

        } );

    }

    function bindEvents() {



    }

    function getActivity() {

        gvtc.user_data.getUserProfileData()
            .then( function ( data ) {

                return {
                    "statement": data.Data.Statements[ 0 ]
                };

            } ).then( function ( data ) {

                return self.fetchAndRenderTemplate(
                    "src/templates/activity.html ", data );

            } )
            .then( function ( html ) {

                var target = self.qs( ".main-content" );

                target.innerHTML = html;

            } );

    }


    initialize();

} )();