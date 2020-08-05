( function () {

    "use strict"; //https://love2dev.com/blog/javascript-strict-mode/

    var webShare = 'share' in navigator;

    //a little helper object to abstract common code into a single place
    var self = {

        qsa: function ( s ) {
            return document.querySelectorAll( s );
        },

        getAttributeValue: function ( target, attr, levels ) {

            levels = levels || 3;

            var index = 0,
                value = target.getAttribute( attr );

            while ( ( value === null || value === undefined ) &&
                target && target.getAttribute && index++ < levels ) {

                target = target.parentNode;

                if ( target ) {

                    value = target.getAttribute( attr );

                }

            }

            return value;

        },

        on: function ( target, evt, fn, bubble ) {

            if ( typeof target === "string" ) {
                target = this.qsa( target );
            }

            if ( target.length === undefined ) {
                target = [ target ];
            }

            bubble = ( bubble === true ) ? true : false;

            for ( var i = 0; i < target.length; i++ ) {
                target[ i ].addEventListener( evt, fn, bubble );
            }

        },

        toggleClass: function ( target, className ) {

            target = this.qsa( target );

            for ( var i = 0; i < target.length; i++ ) {

                target[ i ].classList.toggle( className );

            }

        }

    };

    //default setttings
    var defaults = {
            quoteTargets: ".share-quote",
            shareBtn: ".btn-share",
            fallback: ".share-buttons"
        },
        options = {};

    //leaving it open for customization
    function initialize( config ) {

        options = Object.assign( {}, defaults, config );

        displayTargets()
            .then( function () {
                bindShareButtons();
            } );

    }

    //show native share button or fallback buttons
    function displayTargets() {

        //feature detect to show/hide native or fallback targets
        if ( navigator.share ) {
            // If we have web share enabled use that
            self.toggleClass( options.shareBtn, "invisible" );
        } else {
            // Else do something else to help people share
            // your content
            self.toggleClass( options.fallback, "invisible" );

        }

        return Promise.resolve();

    }

    //bind sharebutton handlers to button(s) and pull quotes
    function bindShareButtons() {

        self.on( options.shareBtn, "click", sendTarget );
        self.on( options.quoteTargets, "click", sendTarget );

    }

    function sendTarget( evt ) {

        evt.preventDefault();

        var target = evt.target;

        if ( webShare ) {

            var share = {
                title: self.getAttributeValue( target, "share-title" ),
                text: self.getAttributeValue( target, "share-text" ),
                url: self.getAttributeValue( target, "share-url" )
            };

            navigator.share( share )
                .then( function () {
                    console.log( 'Successful share' )
                } )
                .catch( function ( error ) {
                    console.log( 'Error sharing', error )
                } );

        }

        return false;

    }

    initialize();

} )();