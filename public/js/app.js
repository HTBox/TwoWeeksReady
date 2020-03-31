( function () {


    window.gvtc = window.gvtc || {};

    var self = gvtc.component;

    function initialize() {

        var path = location.pathname.replace( /\//, "" );

        if ( path === "" ) {
            path = "/";
        }

        var navNode = self.qs( "a[href*='" +
            path + "']" );

        if ( navNode ) {
            navNode.classList.add( "active" );
        }

        window.authorized = true;

        loadPage();

        /*
        gvtc.auth.isAuthenticated()
            .then( function ( auth ) {

                if ( !auth ) {

                    gvtc.auth.refreshTokens()
                        .then( function () {

                            window.authorized = true;

                            loadPage();

                        } )
                        .catch( function ( err ) {

                            window.authorized = false;

                            loadPage();

                        } );

                } else {

                    window.authorized = true;

                    loadPage();
                }

            } );
*/

        registerServiceWorker();

        bindEvents();

    }

    function bindEvents() {

        self.on( ".btn-back", "click", function ( e ) {
            e.preventDefault();

            history.back();

            return false;
        } );

    }

    function loadPage() {

        window.pageLoaded = true;

        self.on( ".btn-navbar-toggle", gvtc.events.click, expandNavBarMenu );
        self.on( ".navbar-toggle", gvtc.events.click, expandSidebar );
        self.on( ".btn-logout", gvtc.events.click, logout );

        document.body.addEventListener( gvtc.events.click, toggleOverlaysOff );

        if ( window.addToHomescreen ) {

            addToHomescreen( {
                appID: "com.gvtc",
                appName: "GVTC",
                lifespan: 15,
                startDelay: 5,
                autostart: true,
                skipFirstVisit: false,
                minSessions: 0,
                displayPace: 1,
                customCriteria: true,
                debug: true,
                customPrompt: {
                    title: "Install GVTC?",
                    src: "meta/chrome/chrome-extensionmanagementpage-48-48.png",
                    cancelMsg: "Cancel",
                    installMsg: "Install"
                }
            } );
        }

        initAppBar();

    }

    function expandNavBarMenu( e ) {
        e.preventDefault();

        var rightNavbar = self.qs( ".right-navbar" );

        rightNavbar.classList.toggle( "show" );

        return false;
    }

    function expandSidebar( e ) {
        e.preventDefault();
        e.stopPropagation();

        var $html = self.qs( "html" );

        $html.classList.toggle( "nav-open" );

        return false;
    }


    function toggleOverlaysOff( e ) {

        //        e.preventDefault();

        var $html = self.qs( "html" );

        $html.classList.remove( "nav-open", "show-search-box" );

        //        return false;

    }

    function send_message_to_sw( msg ) {

        if ( navigator.serviceWorker.controller ) {
            navigator.serviceWorker.controller.postMessage( msg );
        }
    }

    function logout() {

        gvtc.auth.signOut();

    }

    function initAppBar() {

        if ( self.qs( ".appbar-bottom" ) ) {

            self.on( ".appbar-bottom li", "click", function ( e ) {

                e.preventDefault();

                var target = e.currentTarget.getAttribute( "appbar-target" );

                location.href = target;

                return false;
            } );

        }

    }

    function registerServiceWorker() {

        if ( "serviceWorker" in navigator ) {

            navigator.serviceWorker.register( "/sw.js" ).then( function ( registration ) { // Registration was successful

                if ( registration.active ) {

                    send_message_to_sw( "precache-update" );

                }

                console.log( "ServiceWorker registration successful with scope: ", registration.scope );
            } ).catch( function ( err ) { // registration failed :(

                console.log( "ServiceWorker registration failed: ", err );
            } );

            function send_message_to_sw( msg ) {

                if ( navigator.serviceWorker.controller ) {
                    navigator.serviceWorker.controller.postMessage( msg );
                }
            }

            navigator.serviceWorker.onmessage = function ( evt ) {

                var message = JSON.parse( evt.data ),
                    isRefresh = message.type === "refresh",
                    isAsset = message.url.includes( "asset" ),
                    lastETag = localStorage.currentETag,
                    isNew = lastETag !== message.eTag;

                if ( isRefresh && isAsset && isNew ) {

                    if ( lastETag ) {

                        notice.hidden = false;

                    }

                    //this needs to be idb
                    localStorage.currentETag = message.eTag;

                }

            };

        }

    }

    if ( document.readyState === "complete" ) {

        initialize();

    } else {

        document.addEventListener( "readystatechange", function ( event ) {

            if ( event.target.readyState === "complete" ) {

                initialize();

            }

        } );

    }

} )();