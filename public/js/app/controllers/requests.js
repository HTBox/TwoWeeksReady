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
                    getRequests()
                        .then( bindEvents );

                }

            } else {
                initialize();
            }

        } );

    }

    function bindEvents() {



    }

    function getRequests() {

        return gvtc.user_data.getUserProfileData()
            .then( function ( data ) {

                return self.fetchAndRenderTemplate(
                    "src/templates/request-list.html ", data.Data );

            } )
            .then( function ( html ) {

                var target = self.qs( ".main-content" );

                target.innerHTML = html;

            } );

    }


    initialize();

} )();