( function () {

    "use strict";

    window.gvtc = window.gvtc || {};

    var self = window.gvtc.component;

    var qs;


    function initialize() {

        requestAnimationFrame( function () {

            if ( window.pageLoaded ) {

                if ( !window.authorized ) {

                    location.href = "login/";

                } else {

                    //verify logged in
                    getProfile()
                        .then( bindEvents );

                }

            } else {
                initialize();
            }

        } );

    }

    function bindEvents() {



    }

    function getProfile() {

        return gvtc.user_data.getUserProfileData()
            .then( function ( data ) {

                return data.Data.Profile;

            } )
            .then( function ( profile ) {

                return self.fetchAndRenderTemplate(
                    "src/templates/profile.html ", profile );

            } )
            .then( function ( html ) {

                var target = self.qs( ".main-content" );

                target.innerHTML = html;

            } );

    }


    initialize();

} )();