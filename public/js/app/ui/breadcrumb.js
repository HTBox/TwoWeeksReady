( function () {

    "use strict";

    var self = mehab.component;

    mehab.utils.nameSpace( "mehab.tab_panel" );

    var defaults = {
            wrapper: ".tab-container",
            tab: ".tab-tab",
            panel: ".tab-pane"
        },
        settings;

    var wrapper;

    function initialize( options ) {

        settings = Object.assign( {}, defaults, options );

        wrapper = document.querySelector( settings.wrapper );

        if ( !wrapper ) {
            console.error( "no tab components available" );
        }

        bindEvents();

    }

    function bindEvents() {

        var tabs = wrapper.querySelectorAll( settings.tab );

        for ( var i = 0; i < tabs.length; i++ ) {
            tabs[ i ].addEventListener( "click", toggleTabs, false );
        }

        return;
    }

    function toggleTabs( e ) {

        e.preventDefault();

        hidePanels();

        var tab = e.target,
            panelId = tab.getAttribute( "tab-panel-id" ),
            panel = wrapper.querySelector( panelId );

        if ( panel ) {
            panel.classList.add( "active" );
        }

        e.target.classList.add( "active" );

    }

    function hidePanels() {

        var panels = wrapper.querySelectorAll( settings.panel ),
            tabs = wrapper.querySelectorAll( settings.tab );

        for ( var index = 0; index < panels.length; index++ ) {

            panels[ index ].classList.remove( "active" );

        }

        for ( index = 0; index < tabs.length; index++ ) {

            tabs[ index ].classList.remove( "active" );

        }

    }

    window.breadcrumb = {
        initialize: initialize
    };

} )();