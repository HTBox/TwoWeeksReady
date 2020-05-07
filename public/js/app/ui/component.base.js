( function () {

    "use strict";

    window.love2dev = window.love2dev || {};

    function isValidDate( d ) {
        return d instanceof Date && !isNaN( d );
    }

    function queryStringtoJSON() {

        var pairs = location.search.slice( 1 ).split( '&' );

        var result = {};
        pairs.forEach( function ( pair ) {
            pair = pair.split( '=' );
            result[ pair[ 0 ] ] = decodeURIComponent( pair[ 1 ] || '' );
        } );

        return result;

    }

    function jsonToQueryString( json ) {

        if ( !json ) {
            return "";
        }

        return '?' +
            Object.keys( json ).map( function ( key ) {
                return encodeURIComponent( key ) + '=' +
                    encodeURIComponent( json[ key ] );
            } ).join( '&' );
    }

    var type = {
        lower: 'abcdefghijklmnopqrstuvwxyz',
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        number: '0123456789',
        special: '~!@#$%^&()_+-={}[];\',.'
    };

    var KEYS = {
        "0": 48,
        "9": 57,
        "NUMPAD_0": 96,
        "NUMPAD_9": 105,
        "DELETE": 46,
        "BACKSPACE": 8,
        "ARROW_LEFT": 37,
        "ARROW_RIGHT": 39,
        "ARROW_UP": 38,
        "ARROW_DOWN": 40,
        "HOME": 36,
        "END": 35,
        "TAB": 9,
        "A": 65,
        "X": 88,
        "C": 67,
        "V": 86,
        "ENTER": 13,
        "ESC": 27
    };

    /**
     * Get the key code from the given event.
     *
     * @param e
     * @returns {which|*|Object|which|which|string}
     */
    function keyCodeFromEvent( e ) {
        return e.which || e.keyCode;
    }

    /**
     * Get whether a command key (ctrl of mac cmd) is held down.
     *
     * @param e
     * @returns {boolean|metaKey|*|metaKey}
     */
    function keyIsCommandFromEvent( e ) {
        return e.ctrlKey || e.metaKey;
    }


    /**
     * Is the event a number key.
     *
     * @param e
     * @returns {boolean}
     */
    function keyIsNumber( e ) {
        return keyIsTopNumber( e ) || keyIsKeypadNumber( e );
    }


    /**
     * Is the event a top keyboard number key.
     *
     * @param e
     * @returns {boolean}
     */
    function keyIsTopNumber( e ) {
        var keyCode = keyCodeFromEvent( e );
        return keyCode >= KEYS[ "0" ] && keyCode <= KEYS[ "9" ];
    }


    /**
     * Is the event a keypad number key.
     *
     * @param e
     * @returns {boolean}
     */
    function keyIsKeypadNumber( e ) {
        var keyCode = keyCodeFromEvent( e );
        return keyCode >= KEYS[ "NUMPAD_0" ] && keyCode <= KEYS[ "NUMPAD_9" ];
    }


    /**
     * Is the event a delete key.
     *
     * @param e
     * @returns {boolean}
     */
    function keyIsDelete( e ) {
        return keyCodeFromEvent( e ) == KEYS[ "DELETE" ];
    }


    /**
     * Is the event a backspace key.
     *
     * @param e
     * @returns {boolean}
     */
    function keyIsBackspace( e ) {
        return keyCodeFromEvent( e ) == KEYS[ "BACKSPACE" ];
    }


    /**
     * Is the event a deletion key (delete or backspace)
     *
     * @param e
     * @returns {boolean}
     */
    function keyIsDeletion( e ) {
        return keyIsDelete( e ) || keyIsBackspace( e );
    }


    /**
     * Is the event an arrow key.
     *
     * @param e
     * @returns {boolean}
     */
    function keyIsArrow( e ) {
        var keyCode = keyCodeFromEvent( e );
        return keyCode >= KEYS[ "ARROW_LEFT" ] && keyCode <= KEYS[ "ARROW_DOWN" ];
    }


    /**
     * Is the event a navigation key.
     *
     * @param e
     * @returns {boolean}
     */
    function keyIsNavigation( e ) {
        var keyCode = keyCodeFromEvent( e );
        return keyCode == KEYS[ "HOME" ] || keyCode == KEYS[ "END" ];
    }


    /**
     * Is the event a keyboard command (copy, paste, cut, highlight all)
     *
     * @param e
     * @returns {boolean|metaKey|*|metaKey|boolean}
     */
    function keyIsKeyboardCommand( e ) {

        var keyCode = keyCodeFromEvent( e );

        return keyIsCommandFromEvent( e ) &&
            (
                keyCode == KEYS[ "A" ] ||
                keyCode == KEYS[ "X" ] ||
                keyCode == KEYS[ "C" ] ||
                keyCode == KEYS[ "V" ]
            );
    }


    /**
     * Is the event the tab key?
     *
     * @param e
     * @returns {boolean}
     */
    function keyIsTab( e ) {
        return keyCodeFromEvent( e ) == KEYS[ "TAB" ];
    }

    function numbersOnlyString( string ) {
        var numbersOnlyString = "";
        for ( var i = 0; i < string.length; i++ ) {
            var currentChar = string.charAt( i );
            var isValid = !isNaN( parseInt( currentChar ) );
            if ( isValid ) {
                numbersOnlyString += currentChar;
            }
        }
        return numbersOnlyString;
    }

    /**
     * Get the caret start position of the given element.
     *
     * @param element
     * @returns {*}
     */
    function caretStartPosition( element ) {
        if ( typeof element.selectionStart == "number" ) {
            return element.selectionStart;
        }
        return false;
    }


    /**
     * Gte the caret end position of the given element.
     *
     * @param element
     * @returns {*}
     */
    function caretEndPosition( element ) {
        if ( typeof element.selectionEnd == "number" ) {
            return element.selectionEnd;
        }
        return false;
    }

    /**
     * Set the caret position of the given element.
     *
     * @param element
     * @param caretPos
     */
    function setCaretPosition( element, caretPos ) {
        if ( element != null ) {
            if ( element.createTextRange ) {
                var range = element.createTextRange();
                range.move( 'character', caretPos );
                range.select();
            } else {
                if ( element.selectionStart ) {
                    element.focus();
                    element.setSelectionRange( caretPos, caretPos );
                } else {
                    element.focus();
                }
            }
        }
    }

    /**
     * Normalise the caret position for the given mask.
     *
     * @param mask
     * @param caretPosition
     * @returns {number}
     */
    function normaliseCaretPosition( mask, caretPosition ) {
        var numberPos = 0;
        if ( caretPosition < 0 || caretPosition > mask.length ) {
            return 0;
        }
        for ( var i = 0; i < mask.length; i++ ) {
            if ( i == caretPosition ) {
                return numberPos;
            }
            if ( mask[ i ] == "X" ) {
                numberPos++;
            }
        }
        return numberPos;
    }

    type.all = type.lower + type.upper + type.number + type.special;

    /**
     *
     *
     * @param e
     * @param mask
     */
    function handleMaskedNumberInputKey( e, mask ) {
        filterNumberOnlyKey( e );

        var keyCode = e.which || e.keyCode;

        var element = e.target;

        var caretStart = caretStartPosition( element );
        var caretEnd = caretEndPosition( element );


        // Calculate normalised caret position
        var normalisedStartCaretPosition = normaliseCaretPosition( mask, caretStart );
        var normalisedEndCaretPosition = normaliseCaretPosition( mask, caretEnd );


        var newCaretPosition = caretStart;

        var isNumber = keyIsNumber( e );
        var isDelete = keyIsDelete( e );
        var isBackspace = keyIsBackspace( e );

        if ( isNumber || isDelete || isBackspace ) {
            e.preventDefault();
            var rawText = $( element ).val();
            var numbersOnly = numbersOnlyString( rawText );

            var digit = digitFromKeyCode( keyCode );

            var rangeHighlighted = normalisedEndCaretPosition >
                normalisedStartCaretPosition;

            // Remove values highlighted (if highlighted)
            if ( rangeHighlighted ) {
                numbersOnly = ( numbersOnly.slice( 0, normalisedStartCaretPosition ) +
                    numbersOnly.slice( normalisedEndCaretPosition ) );
            }

            // Forward Action
            if ( caretStart != mask.length ) {

                // Insert number digit
                if ( isNumber && rawText.length <= mask.length ) {
                    numbersOnly = ( numbersOnly.slice( 0, normalisedStartCaretPosition ) +
                        digit + numbersOnly.slice( normalisedStartCaretPosition ) );
                    newCaretPosition = Math.max(
                        denormaliseCaretPosition( mask, normalisedStartCaretPosition + 1 ),
                        denormaliseCaretPosition( mask, normalisedStartCaretPosition + 2 ) - 1
                    );
                }

                // Delete
                if ( isDelete ) {
                    numbersOnly = ( numbersOnly.slice( 0, normalisedStartCaretPosition ) + numbersOnly.slice( normalisedStartCaretPosition + 1 ) );
                }

            }

            // Backward Action
            if ( caretStart != 0 ) {

                // Backspace
                if ( isBackspace && !rangeHighlighted ) {
                    numbersOnly = ( numbersOnly.slice( 0, normalisedStartCaretPosition - 1 ) + numbersOnly.slice( normalisedStartCaretPosition ) );
                    newCaretPosition = denormaliseCaretPosition( mask, normalisedStartCaretPosition - 1 );
                }
            }

            element.value = applyFormatMask( numbersOnly, mask );

            setCaretPosition( element, newCaretPosition );
        }
    }

    /**
     *
     *
     * @param keyCode
     * @returns {*}
     */
    function digitFromKeyCode( keyCode ) {

        if ( keyCode >= KEYS[ "0" ] && keyCode <= KEYS[ "9" ] ) {
            return keyCode - KEYS[ "0" ];
        }

        if ( keyCode >= KEYS[ "NUMPAD_0" ] && keyCode <= KEYS[ "NUMPAD_9" ] ) {
            return keyCode - KEYS[ "NUMPAD_0" ];
        }

        return null;
    }

    /**
     *
     *
     * @param e
     */
    function filterNumberOnlyKey( e ) {

        var isNumber = keyIsNumber( e );
        var isDeletion = keyIsDeletion( e );
        var isArrow = keyIsArrow( e );
        var isNavigation = keyIsNavigation( e );
        var isKeyboardCommand = keyIsKeyboardCommand( e );
        var isTab = keyIsTab( e );

        if ( !isNumber && !isDeletion && !isArrow && !isNavigation && !isKeyboardCommand && !isTab ) {
            e.preventDefault();
        }
    }

    function isNumber( value ) {
        return Number.isInteger( parseInt( value, 10 ) );
    }

    /**
     * Denormalise the caret position for the given mask.
     *
     * @param mask
     * @param caretPosition
     * @returns {*}
     */
    function denormaliseCaretPosition( mask, caretPosition ) {
        var numberPos = 0;
        if ( caretPosition < 0 || caretPosition > mask.length ) {
            return 0;
        }
        for ( var i = 0; i < mask.length; i++ ) {
            if ( numberPos == caretPosition ) {
                return i;
            }
            if ( mask[ i ] == "X" ) {
                numberPos++;
            }
        }
        return mask.length;
    }

    /**
     * Apply a format mask to the given string
     *
     * @param string
     * @param mask
     * @returns {string}
     */
    function applyFormatMask( string, mask ) {
        var formattedString = "";
        var numberPos = 0;
        for ( var j = 0; j < mask.length; j++ ) {
            var currentMaskChar = mask[ j ];
            if ( currentMaskChar == "X" ) {
                var digit = string.charAt( numberPos );
                if ( !digit ) {
                    break;
                }
                formattedString += string.charAt( numberPos );
                numberPos++;
            } else {
                formattedString += currentMaskChar;
            }
        }
        return formattedString;
    }

    function zeroPad( num, places ) {
        var zero = places - num.toString().length + 1;
        return Array( +( zero > 0 && zero ) ).join( "0" ) + num;
    }

    function normalizeDate( value ) {

        var d;

        if ( value ) {

            d = new Date( value );

        } else {

            d = new Date();

        }

        value = d.getFullYear() + "-" +
            pad( d.getMonth() + 1, 2 ) + "-" +
            pad( d.getDate(), 2 );

        return value;

    }

    function getSrcMime( fileName ) {

        var ext = fileName.split( '.' ).pop();

        switch ( ext ) {

            case "txt":

                return "text/plain";
            case "svg":

                return "image/svg+xml";
            case "jpg":
            case "jpeg":

                return "image/jpeg";
            case "png":

                return "image/png";
            case "gif":

                return "image/gif";

            case "webp":

                return "image/webp";
            default:
                return "application/octet-stream";
        }

    }

    function toggleModalBackground() {

        var $modalBackground = qs( ".modal-bg" );

        $modalBackground.classList.toggle( love2dev.cssClasses.show );

    }

    function toggleModal( modal ) {

        toggleModalBackground();

        var $modals = qsa( ".modal" ),
            $modal = qs( modal );

        modal = modal.replace( ".", "" );

        for ( var index = 0; index < $modals.length; index++ ) {

            var target = $modals[ index ];

            if ( !target.classList.contains( modal ) ) {
                target.classList.remove( love2dev.cssClasses.show );
            }

        }

        $modal.classList.toggle( love2dev.cssClasses.show );

    }

    function qs( s ) {

        if ( typeof s === "string" ) {
            return document.querySelector( s );
        } else {
            return s;
        }

    }

    function qsa( s ) {
        return document.querySelectorAll( s );
    }

    function verifySlug( slug ) {

        var slugEle = qs( SLUG );

        if ( initialSlug === slug ) {

            slugEle.classList.remove( BGWARN );

            return Promise.resolve( true );
        }

        return admin.pages.verifySlug( slug, domain )
            .then( function ( available ) {

                slugAvailable = available;

                if ( available ) {

                    slugEle.classList.remove( BGWARN );

                } else {

                    slugEle.classList.add( BGWARN );

                }

            } );
    }

    function makeSlug( src ) {

        if ( typeof src === "string" ) {

            return src.toLowerCase()
                .replace( / +/g, "-" )
                .replace( /\'/g, "" )
                .replace( /&/g, '-and-' )
                //OK so I know this is goofy, but I need forward slashes
                //and well regex makes my brain hurt
                .replace( /\//g, "WHACK" ).replace( /[^\w-]+/g, "" ).replace( /WHACK/g, "/" )
                .replace( /-+/g, "-" )
                .replace( /^-+/, '' ) // Trim - from start of text
                .replace( /-+$/, '' ); // Trim - from end of text;

        }

        return "";

    }

    function validateUrl( value ) {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
    }

    function wordCount( src ) {

        if ( src ) {

            var cleaned = src.replace( /(<([^>]+)>)/ig, " " ).replace( /  /g, " " );

            cleaned = cleaned.split( " " );

            return cleaned.length;

        } else {
            return 0;
        }

    }

    function characterCount( target, maxCount ) {

        if ( target && maxCount ) {

            var value = target.value.trim(),
                exceededClass = "exceeded-suggested-length";

            target.classList.remove( exceededClass );

            if ( value.length > maxCount ) {

                target.classList.add( exceededClass );

            } else {

                if ( value.length > ( maxCount * 0.9 ) ) {

                    var length = 0,
                        words = value.split( " " );

                    for ( var index = 0; index < words.length; index++ ) {

                        length += words[ index ].length + 1;

                        if ( length > maxCount ) {

                            target.classList.add( exceededClass );

                            index = words.length;

                        }

                    }

                }

            }

            return value.length;

        }

    }

    function convertRadio( src ) {

        var $src = qs( "[name='" + src + "']" );

        if ( $src ) {
            return $src.checked;
        } else {
            return false;
        }

    }

    function updateCharacterCountRecord( src, target, maxCount ) {

        var bodyEle = qs( src ),
            wCount = qs( target ),
            count = parseInt( characterCount( bodyEle, maxCount ), 10 );

        wCount.innerText = count;

        wCount.classList.remove( "text-danger" );
        wCount.classList.remove( "text-warning" );
        wCount.classList.remove( "text-success" );
        wCount.classList.remove( "text-primary" );

        switch ( true ) {
            case count >= 4000:

                wCount.classList.add( "text-primary" );

                break;

            case count >= 2000:

                wCount.classList.add( "text-success" );

                break;

            case count >= 500:

                wCount.classList.add( "text-warning" );

                break;

            default:

                wCount.classList.add( "text-danger" );

                break;

        }

    }

    function fetchAndRenderTemplate( src, data ) {

        return fetchTemplate( {
                src: src
            } )
            .then( function ( template ) {

                return renderTemplate( template, data );

            } );

    }

    function renderTemplate( html, data ) {

        return Mustache.render( html, data );

    }

    function fetchTemplate( options ) {

        return fetch( options.src )
            .then( function ( response ) {

                return response.text();

            } );

    }

    function appendLeadingZeroes( n ) {
        if ( n <= 9 ) {
            return "0" + n;
        }
        return n;
    }

    function hashCode( s ) {

        return s.split( "" ).reduce( function ( a, b ) {
            a = ( ( a << 5 ) - a ) + b.charCodeAt( 0 );
            return a & a;
        }, 0 );

    }

    /**
     * contains common methods used to manage UI
     * Assumes Mustache is global
     */
    love2dev.component = {

        fetchAndRenderTemplate: fetchAndRenderTemplate,
        fetchTemplate: fetchTemplate,
        renderTemplate: renderTemplate,

        convertRadio: convertRadio,
        wordCount: wordCount,
        characterCount: characterCount,
        makeSlug: makeSlug,
        validateUrl: validateUrl,
        verifySlug: verifySlug,
        updateCharacterCountRecord: updateCharacterCountRecord,

        /**
         * Converts a string to its html characters completely.
         *
         * @param {String} str String with unescaped HTML characters
         **/
        encode: function ( str ) {
            var buf = [];

            for ( var i = str.length - 1; i >= 0; i-- ) {
                buf.unshift( [ '&#', str[ i ].charCodeAt(), ';' ].join( '' ) );
            }

            return buf.join( '' );
        },

        /**
         * Converts an html characterSet into its original character.
         *
         * @param {String} str htmlSet entities
         **/
        decode: function ( str ) {
            return str.replace( /&#(\d+);/g, function ( match, dec ) {
                return String.fromCharCode( dec );
            } );
        },

        bindFormValues: function ( targetForm, obj ) {

            var key;

            for ( key in obj ) {

                if ( obj.hasOwnProperty( key ) ) {

                    var input = this.qs( "select[name='" + key + "'], input[name='" + key + "'], textarea[name='" + key + "']" ),
                        value = obj[ key ];

                    if ( !value ) {
                        value = "";
                    }

                    if ( typeof value === "object" ) {

                        value = JSON.stringify( value );

                    }

                    if ( input ) {

                        if ( typeof value === "string" || typeof value === "number" ) {

                            input.value = value;

                        } else { //assume boolean

                            input.checked = value;

                        }

                    }

                }

            }

        },

        bindSelect: function ( opts ) {

            var $target = this.qs( opts.selector ),
                data = opts.data;

            if ( $target ) {

                for ( var index = 0; index < data.length; index++ ) {

                    var layout = data[ index ];

                    var option = document.createElement( "option" );

                    option.value = layout.value;
                    option.text = layout.text;

                    $target.add( option );

                }

            }

            return $target;

        },

        init: function ( config ) {

            //todo: merge external depenendencies into the core

        },

        parse: function ( src ) {

            if ( typeof src === "string" ) {
                return JSON.parse( src );
            }

            return src;

        },

        stringify: function ( src ) {

            if ( typeof src !== "string" ) {
                return JSON.stringify( src );
            }

            return src;

        },

        toggleHidden: function ( show, hide ) {

            hide.classList.add( hidden );
            show.classList.remove( hidden );

        },

        toggleFlexNone: function ( target ) {

            target.classList.toggle( love2dev.cssClasses.dFlex );
            target.classList.toggle( love2dev.cssClasses.dNone );

        },

        getDate: function ( value ) {

            var dt = new Date( value );

            if ( isValidDate( dt ) ) {
                return dt;
            } else {
                return new Date();
            }

        },


        parentAttributeValue: function ( target, attrName, level ) {

            var value = target.parentElement.getAttribute( attrName );

            if ( value ) {

                return value;

            } else {

                if ( level && level > 2 ) {
                    return level;
                }

                if ( level === undefined ) {
                    level = 0;
                }

                return this.parentAttributeValue( target.parentElement, attrName, ++level );

            }

        },

        qs: qs,
        qsa: qsa,

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

        setFocus: function ( target ) {

            var $target = document.querySelector( target );

            if ( $target ) {
                $target.focus();
            }

        },

        createFragment: function ( htmlStr ) {

            var frag = document.createDocumentFragment(),
                temp = document.createElement( 'div' );

            temp.innerHTML = htmlStr;

            while ( temp.firstChild ) {
                frag.appendChild( temp.firstChild );
            }

            return frag;
        },

        toggleDisabled: function ( target, state ) {

            var $target = this.qs( target );

            $target.disabled = state;
            $target.setAttribute( "aria-disabled", state );
            //       $target.setAttribute( "disabled", state );

        },

        getParameterByName: function ( name, url ) {

            if ( !url ) {
                url = window.location.href;
            }

            name = name.replace( /[\[\]]/g, "\\$&" );

            var regex = new RegExp( "[?&]" + name + "(=([^&#]*)|&|#|$)" ),
                results = regex.exec( url );

            if ( !results ) {

                return null;

            }

            if ( !results[ 2 ] ) {

                return '';
            }

            return decodeURIComponent( results[ 2 ].replace( /\+/g, " " ) );

        },

        setupChips: function ( opts ) {

            var tags = [],
                autoComplete = {
                    data: {},
                    minLength: 1
                },
                index = 0;

            if ( opts.tags ) {

                for ( index = 0; index < opts.tags.length; index++ ) {

                    tags.push( {
                        tag: opts.tags[ index ],
                    } );

                }

            }

            for ( index = 0; index < opts.autoComplete.length; index++ ) {

                autoComplete.data[ opts.autoComplete[ index ].tag ] = null;

            }

            return $( ".tag-chips" ).material_chip( {
                placeholder: "Article Tags",
                data: tags,
                autocompleteOptions: autoComplete,
                onChipAdd: opts.onChipAdd,
                onChipSelect: opts.onChipSelect,
                onChipDelete: opts.onChipDelete
            } );

        },

        getChips: function ( selector ) {

            var $chips = this.qsa( selector + " .chip" ),
                chips = [];

            for ( var index = 0; index < $chips.length; index++ ) {

                chips.push( $chips[ index ].innerText );

            }

            return chips;

        },

        toggleModalBackground: toggleModalBackground,
        toggleModal: toggleModal,

        isValidDate: isValidDate,
        normalizeDate: normalizeDate,
        keyIsTab: keyIsTab,
        keyIsKeyboardCommand: keyIsKeyboardCommand,
        keyIsNavigation: keyIsNavigation,
        keyIsArrow: keyIsArrow,
        keyIsDeletion: keyIsDeletion,
        keyIsBackspace: keyIsBackspace,
        keyIsDelete: keyIsDelete,
        keyIsKeypadNumber: keyIsKeypadNumber,
        keyIsTopNumber: keyIsTopNumber,
        keyIsNumber: keyIsNumber,
        keyIsCommandFromEvent: keyIsCommandFromEvent,
        keyCodeFromEvent: keyCodeFromEvent,
        numbersOnlyString: numbersOnlyString,
        applyFormatMask: applyFormatMask,
        filterNumberOnlyKey: filterNumberOnlyKey,
        caretStartPosition: caretStartPosition,
        caretEndPosition: caretEndPosition,
        setCaretPosition: setCaretPosition,
        normaliseCaretPosition: normaliseCaretPosition,
        denormaliseCaretPosition: denormaliseCaretPosition,
        digitFromKeyCode: digitFromKeyCode,
        isNumber: isNumber,
        KEYS: KEYS,
        zeroPad: zeroPad,
        pad: zeroPad,
        jsonToQueryString: jsonToQueryString,
        queryStringtoJSON: queryStringtoJSON,
        getSrcMime: getSrcMime,
        appendLeadingZeroes: appendLeadingZeroes,
        hashCode: hashCode
    };

    love2dev.cssClasses = {
        "dNone": "d-none",
        "dFlex": "d-flex",
        "dBlock": "d-block",
        "dSmNone": "d-sm-none",
        "dSmFlex": "d-sm-flex",
        "dSmBlock": "d-sm-block",
        "hide": "hide",
        "show": "show",
        "hidden": "hidden",
        "active": "active"
    };

    love2dev.events = {

        click: "click",
        keyup: "keyup",
        input: "input",
        keydown: "keydown",
        change: "change",
        select: "select",
        focus: "focus",
        blur: "blur",
        submit: "submit",
        mousedown: "mousedown",
        inputValidate: "keyup blur"
    };

}() );