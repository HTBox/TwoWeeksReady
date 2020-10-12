( function () {

    window.httoolbox = window.httoolbox || {};

    var helpers = love2dev.component;
    var ath,
        _authCallback = [],
        _notAuthCallback = [],
        _loadPageCallback = [],
        _canPromptCallback = [],
        platform, ath,
        siteConfig = {
            tennantId: "62274796-e691-46ae-aa31-c30cdafb3258",
            siteId: "6bbc47ff-57b1-408e-99a0-16b4c470de03"
        };

    var UPDATE_USER_PROTOCOL_MEDIA = "update-user-protocol-media",
        PREFERENCE_KEY = "user-prefernces",
        SITE_CONFIG = "site-config",
        A2HS_PROMPT = "a2hs-prompt";

    function initialize() {

        love2dev.auth.isAuthenticated()
            .then( function ( auth ) {

                if ( !auth ) {

                    executeCallbacks( _notAuthCallback );

                    loadPage();

                } else {

                    window.authorized = true;

                    executeCallbacks( _authCallback );

                    loadPage();

                }

            } );

        registerServiceWorker();

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

    function initA2HSState() {

        return localforage.getItem( A2HS_PROMPT )
            .then( function ( state ) {

                if ( state === undefined || state === null ) {
                    return localforage.setItem( A2HS_PROMPT, true );
                }

            } );

    }

    function checkAddToHomeScreen() {

        if ( window.addToHomescreen ) {

            return localforage.getItem( A2HS_PROMPT )
                .then( function ( state ) {

                    if ( state ) {

                        ath = addToHomescreen( {
                            appID: "net.mehab",
                            appName: "Mehab",
                            lifespan: 15,
                            autostart: false,
                            skipFirstVisit: false,
                            minSessions: 0,
                            maxDisplayCount: 5,
                            onCancel: handleA2HSCancel,
                            onInstall: handleA2HSInstall,
                            customCriteria: true,
                            customPrompt: {
                                title: "Install Mehab?",
                                src: "meta/favicon-96x96.png",
                                cancelMsg: "Cancel",
                                installMsg: "Install"
                            }
                        } );

                        ath.options.promptDlg.cancel = ".btn-close-a2hs";
                        ath.options.promptDlg.install = ".btn-install-mehab";
                        ath.options.logging = true;

                        window.mehab.ath = ath;

                    }

                } );

            /*            self.on( ".btn-install-mehab, .mobile-a2hs-btn", mehab.events.click, function ( e ) {
                            e.preventDefault();

                            ath.platform.handleInstall();

                            return false;
                        } );

                        */

        }

    }

    function handleA2HSCancel() {

        return localforage.setItem( A2HS_PROMPT, false )
            .then( function () {

                var $prompt = self.qs( ".install-prompt" );

                self.toggleFlexNone( $prompt );

            } );

    }

    function handleA2HSInstall() {

        return localforage.setItem( A2HS_PROMPT, false );

        //should we trigger additional messaging?

    }

    function goToLogin() {
        location.href = "login/";
    }

    function signout( e ) {

        e.preventDefault();

        mehab.auth.signOut()
            .then( function () {
                location.href = "/";
            } );

        return false;
    }

    function toggleModalBackground( show ) {

        var action = "toggle";

        if ( show === true ) {
            action = "add";
        } else if ( show === false ) {
            action = "remove";
        }

        var $modalBackground = self.qs( ".modal-bg" );

        if ( $modalBackground ) {

            $modalBackground.classList[ action ]( mehab.cssClasses.show );

        }

    }

    function toggleModal( modal, show ) {

        toggleModalBackground( show );

        var action = "toggle";

        if ( show === true ) {
            action = "add";
        } else if ( show === false ) {
            action = "remove";
        }

        var $modals = self.qsa( ".modal" ),
            $modal = self.qs( modal );

        modal = modal.replace( ".", "" );

        for ( var index = 0; index < $modals.length; index++ ) {

            var target = $modals[ index ];

            if ( !target.classList.contains( modal ) ) {
                target.classList.remove( mehab.cssClasses.show );
            }

        }

        if ( $modal ) {

            $modal.classList[ action ]( mehab.cssClasses.show );

        }

    }

    function authCallback( func ) {

        if ( window.authorized ) {
            func();
        } else {
            _authCallback.push( func );
        }

    }

    function notAuthCallback( func ) {

        if ( window.notAuthorized ) {
            func();
        } else {
            _notAuthCallback.push( func );
        }

    }

    function loadPageCallback( func ) {

        if ( window.loadPage ) {
            func();
        } else {
            _loadPageCallback.push( func );
        }

    }

    function canPromptCallback( func ) {

        if ( window.canPrompt ) {
            func();
        } else {
            _loadPageCallback.push( func );
        }


    }

    function executeCallbacks( targets, params ) {

        for ( var index = 0; index < targets.length; index++ ) {

            targets[ index ]( params );

        }

    }


    function fetchAndInsert( src ) {

        return fetch( src )
            .then( function ( response ) {

                if ( response.ok ) {
                    return response.text();
                }
            } )
            .then( function ( html ) {

                if ( html ) {

                    document.body.appendChild( self.createFragment( html ) );
                }

            } );

    }


    function registerServiceWorker() {

        if ( "serviceWorker" in navigator ) {

            navigator.serviceWorker.register( "/sw.js" ).then( function ( registration ) { // Registration was successful

                if ( registration.active ) {

                    send_message_to_sw( "precache-update" );

                }

                a2hsCheck();

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

    window.love2dev.app = {
        PREFERENCE_KEY: PREFERENCE_KEY,
        goToLogin: goToLogin,
        toggleModalBackground: toggleModalBackground,
        toggleModal: toggleModal,
        authCallback: authCallback,
        notAuthCallback: notAuthCallback,
        loadPageCallback: loadPageCallback,
        canPromptCallback: canPromptCallback,
        fetchAndInsert: fetchAndInsert,
        siteConfig: siteConfig,
        apiBase: "https://rj6n0jgrvg.execute-api.us-east-1.amazonaws.com/dev"
    };


} )();