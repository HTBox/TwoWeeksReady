( function () {

    "use strict";

    if ( !window.mehab ) {
        window.mehab = {};
    }

    var self = mehab.component,
        keyboardBound = "keyboard-bound";

    //get wizard buttons & bind click events
    //next buttons disabled by default
    //validate each panel before moving

    function initialize( options ) {

        if ( options && options.context ) {

            config.context = options.context;

        }

        config.context = self.qs( config.context );

        bindButtons();
        bindInputsForBtnDisable();

    }

    function hidePanels() {

        var panels = self.qsa( ".form-panel" );

        for ( var index = 0; index < panels.length; index++ ) {

            panels[ index ].classList.remove( "show", "d-flex", "active" );
            panels[ index ].classList.add( "d-none" );

        }

    }

    function triggerNavigation( evt ) {

        if ( evt.preventDefault ) {

            evt.preventDefault();

        }

        var button = evt.target,
            _target = button.getAttribute( "wizard-target" );

        togglePanels( config.context.querySelector( _target ), _target );

        return false;

    }

    function togglePanels( target, _target ) {

        var initialFocus;

        hidePanels();

        if ( target ) {

            target.classList.remove( "d-none" );
            target.classList.add( "show", "d-flex", "active" );

            initialFocus = target.querySelector( "[wizard-focus]" );

            if ( initialFocus ) {
                initialFocus.focus();
            } else {

                initialFocus = target.querySelector( "input" );

                if ( initialFocus ) {
                    initialFocus.focus();
                }

            }

            document.dispatchEvent( new CustomEvent(
                "wizardMove", {
                    detail: {
                        target: _target
                    },
                    bubbles: true,
                    cancelable: true
                }
            ) );
        }

    }

    function bindKeyboard( target ) {

        target.addEventListener( "keyup", handleKeyboard );

    }

    function handleKeyboard( evt ) {

        var target = document.querySelector( ".wizard-container .tab-pane:not(.d-none)" ),
            event = new Event( "click" );

        if ( evt.which === 13 ) {

            var nextBtn = target.querySelector( ".btn-wizard-next" );

            if ( nextBtn ) {
                nextBtn.dispatchEvent( event );
            }

        } else if ( evt.which === 8 ) {

            var backBtn = target.querySelector( ".btn-wizard-back" );

            if ( backBtn ) {
                backBtn.dispatchEvent( event );
            }

        }

    }

    function bindButtons() {

        config.buttons = config.context.querySelectorAll( config.btn );

        for ( var index = 0; index < config.buttons.length; index++ ) {

            var button = config.buttons[ index ];

            button.addEventListener( "click", triggerNavigation );

        }

    }

    function bindInputsForBtnDisable() {

        var panels = config.context.querySelectorAll( ".form-panel" );

        for ( var index = 0; index < panels.length; index++ ) {

            var panel = panels[ index ];

            var inputs = panel.querySelectorAll( "[required]" );

            self.on( inputs, mehab.events.keyup, function ( e ) {

                enablePanel( e, panel );

            } );

        }

    }

    function enablePanel( e, panel ) {

        console.log( "change panel enabled state" );

    }

    var config = {
        btn: ".btn-wizard",
        context: "body",
        buttons: []
    };

    window.wizard = {
        initialize: initialize,
        togglePanels: togglePanels
    };

} )();