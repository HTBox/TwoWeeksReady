( function () {

    window.httoolbox = window.httoolbox || {};

    var helpers = love2dev.component;

    function initialize() {

        var path = location.pathname.replace( /\//, "" );

        if ( path === "" ) {
            path = "/";
        }

        var navNode = helpers.qs( "a[href*='" +
            path + "']" );

        if ( navNode ) {
            navNode.classList.add( "active" );
        }

        window.authorized = true;

        loadPage();

        registerServiceWorker();

        bindEvents();

    }

    function bindEvents() {

        helpers.on( ".btn-back", "click", function ( e ) {
            e.preventDefault();

            history.back();

            return false;
        } );

    }

    function loadPage() {

        window.pageLoaded = true;

        helpers.on( ".btn-navbar-toggle", love2dev.events.click, expandNavBarMenu );
        helpers.on( ".navbar-toggle", love2dev.events.click, expandSidebar );
        helpers.on( ".btn-logout", love2dev.events.click, logout );

        document.body.addEventListener( love2dev.events.click, toggleOverlaysOff );

        if ( window.addToHomescreen ) {

            addToHomescreen( {
                appID: "com.love2dev",
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

        var rightNavbar = helpers.qs( ".right-navbar" );

        rightNavbar.classList.toggle( "show" );

        return false;
    }

    function expandSidebar( e ) {
        e.preventDefault();
        e.stopPropagation();

        var $html = helpers.qs( "html" );

        $html.classList.toggle( "nav-open" );

        return false;
    }


    function toggleOverlaysOff( e ) {

        //        e.preventDefault();

        var $html = helpers.qs( "html" );

        $html.classList.remove( "nav-open", "show-search-box" );

        //        return false;

    }

    function send_message_to_sw( msg ) {

        if ( navigator.serviceWorker.controller ) {
            navigator.serviceWorker.controller.postMessage( msg );
        }
    }

    function logout() {

        love2dev.auth.signOut();

    }

    function initAppBar() {

        if ( helpers.qs( ".appbar-bottom" ) ) {

            helpers.on( ".appbar-bottom li", "click", function ( e ) {

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