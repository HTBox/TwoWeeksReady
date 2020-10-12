( function () {

    "use strict";

    var self = love2dev.component;

    var defaults = {
            wrapper: ".tab-container",
            tab: ".tab-tab",
            panel: ".tab-pane"
        },
        settings,
        tabCount,
        tabWidth = 200;

    var wrapper;

    function initialize( options ) {

        settings = Object.assign( {}, defaults, options );

        wrapper = document.querySelector( settings.wrapper );

        if ( !wrapper ) {
            console.error( "no tab components available" );
        } else {

            bindEvents();
            setStyles();

        }

    }

    function bindEvents() {

        var tabs = wrapper.querySelectorAll( settings.tab );

        for ( var i = 0; i < tabs.length; i++ ) {
            tabs[ i ].addEventListener( "click", toggleTabs, false );
        }

        tabCount = tabs.length;

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

    function setStyles() {

        var $tabSliderContainer = self.qs( ".tab-pill-slider-container" );

        if ( $tabSliderContainer ) {

            var $pillContainer = $tabSliderContainer.querySelector( ".nav-pills" ),
                $tabs = $tabSliderContainer.querySelectorAll( ".tab-tab" );

            var sliderWidth = 0;

            for ( var index = 0; index < $tabs.length; index++ ) {

                sliderWidth += parseInt( $tabs[ index ].clientWidth, 10 );

            }

            $pillContainer.style.width = sliderWidth + "px";

        }

    }



    window.tab_panel = {
        initialize: initialize
    };

} )();