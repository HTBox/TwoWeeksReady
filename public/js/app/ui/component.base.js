( function () {

    "use strict";

    window.gvtc = window.gvtc || {};

    //based on bootstrap 4
    var hidden = "hidden",
        show = "show";

    /**
     * contains common methods used to manage UI
     * Assumes Mustache is global
     */
    window.gvtc.component = {

        init: function ( config ) {

            //todo: merge external depenendencies into the core

        },

        toggleHidden: function ( show, hide ) {

            hide.classList.add( hidden );
            show.classList.remove( hidden );

        },

        fetchAndRenderTemplate: function ( src, data ) {

            var self = this;

            return self.fetchTemplate( {
                    src: src
                } )
                .then( function ( template ) {

                    return self.renderTemplate( template, data );

                } );

        },

        renderTemplate: function ( html, data ) {

            return Mustache.render( html, data );

        },

        fetchTemplate: function ( options ) {

            return fetch( options.src )
                .then( function ( response ) {

                    return response.text();

                } );

        },

        parentAttributeValue: function ( target, attrName, level ) {

            var value = target.parentElement.getAttribute( attrName );

            if ( value ) {

                return value;

            } else {

                if ( level && level > 2 ) {
                    return "cardPrinters";
                }

                if ( level === undefined ) {
                    level = 0;
                }

                return this.parentAttributeValue( target.parentElement, attrName, ++level );

            }

        },

        qs: function ( s ) {

            if ( typeof s === "string" ) {
                return document.querySelector( s );
            } else {
                return s;
            }

        },
        qsa: function ( s ) {
            return document.querySelectorAll( s );
        },
        gei: function ( s ) {
            return document.getElementById( s );
        },
        gen: function ( s ) {
            return document.getElementsByName( s );
        },

        /**
         * Event handler method
         * abstracts addEventListener binding
         */
        on: function ( target, evt, fn, bubble ) {

            if ( !target || !evt || !fn ) {
                return;
            }

            if ( typeof target === "string" ) {
                target = this.qsa( target );
            }

            if ( target.length === undefined ) {
                target = [ target ];
            }

            bubble = ( bubble === true ) ? true : false;

            evt = evt.split( " " );

            for ( var i = 0; i < target.length; i++ ) {

                for ( let j = 0; j < evt.length; j++ ) {

                    target[ i ].addEventListener( evt[ j ], fn, bubble );

                }

            }

        },
        off: function ( target, evt, fn, bubble ) {

            if ( typeof target === "string" ) {
                target = this.qsa( target );
            }

            if ( target.length === undefined ) {
                target = [ target ];
            }

            for ( var i = 0; i < target.length; i++ ) {
                target[ i ].removeEventListener( evt, fn, bubble );
            }

        },

        toggleDisabled: function ( target, state ) {

            var $target = this.qs( target );

            $target.disabled = state;
            $target.setAttribute( "aria-disabled", state );

        }

    };

    window.gvtc.events = {

        click: "click",
        keyup: "keyup",
        keydown: "keydown",
        change: "change",
        select: "select",
        focus: "focus",
        blur: "blur",
        submit: "submit"
    };

}() );