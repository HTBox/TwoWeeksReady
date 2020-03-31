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

                    qs = gvtc.queryStringtoJSON();

                    //verify logged in
                    getRequest()
                        .then( bindEvents );

                }

            } else {
                initialize();
            }

        } );

    }

    function bindEvents() {



    }

    function getRequest() {

        return gvtc.user_data.getUserProfileData()
            .then( function ( data ) {

                for ( var index = 0; index < data.Data.ServiceRequests.length; index++ ) {

                    var request = data.Data.ServiceRequests[ index ];

                    if ( request.RecordId === qs.id ) {
                        return request;
                    }

                }

            } )
            .then( function ( request ) {

                return self.fetchAndRenderTemplate(
                    "src/templates/request-details.html ", request );

            } )
            .then( function ( html ) {

                var target = self.qs( ".main-content" );

                target.innerHTML = html;

            } );

    }


    initialize();

} )();