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

                    bindEvents();

                }

            } else {
                initialize();
            }

        } );

    }

    function bindEvents() {



    }




    initialize();

} )();