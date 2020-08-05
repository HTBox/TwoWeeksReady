/* Add to Homescreen v4.0.0 ~ (c) 2019 Chris Love ~ @license: https://love2dev.com/pwa/add-to-homescreen/ */
/*
Check out these PWA Resources:

https://love2dev.com/pwa/pwa-starter/
https://pwastarter.love2dev.com/
https://love2dev.com/blog/beforeinstallprompt/

*/

/*
       _   _ _____     _____
 ___ _| |_| |_   _|___|  |  |___ _____ ___ ___ ___ ___ ___ ___ ___
| .'| . | . | | | | . |     | . |     | -_|_ -|  _|  _| -_| -_|   |
|__,|___|___| |_| |___|__|__|___|_|_|_|___|___|___|_| |___|___|_|_|
	by Matteo Spinelli ~ http://cubiq.org <-- No longer there :<
	Upgraded for PWA Support by Chris Love ~ https://love2dev.com/
	USE PWA Starter to scaffold your core PWA files ~ https://pwastarter.love2dev.com/
*/

( function ( window, document, undefined ) {
	"use strict";

	// load session
	var nativePrompt = false,
		_instance,
		_canPrompt,
		_canInstall,
		_beforeInstallPrompt,
		session;

	var platform = {
			isCompatible: false
		},
		options = {},
		defaults = {
			appID: "com.love2dev.addtohome", // local storage name (no need to change)
			appName: "Progressive Web App",
			debug: false, // override browser checks
			logging: false, // log reasons for showing or not showing to js console; defaults to true when debug is true
			modal: false, // prevent further actions until the message is closed
			mandatory: false, // you can't proceed if you don't add the app to the homescreen
			autostart: true, // show the message automatically
			skipFirstVisit: false, // show only to returning visitors (ie: skip the first time you visit)
			minSessions: 0, //show only after minimum number of page views
			startDelay: 1, // display the message after that many seconds from page load
			lifespan: 15, // life of the message in seconds
			displayPace: 1440, // minutes before the message is shown again (0: display every time, default 24 hours)
			mustShowCustomPrompt: false,
			maxDisplayCount: 0, // absolute maximum number of times the message will be shown to the user (0: no limit)
			validLocation: [], // list of pages where the message will be shown (array of regexes)
			onInit: null, // executed on instance creation
			onShow: null, // executed when the message is shown
			onAdd: null, // when the application is launched the first time from the homescreen (guesstimate)
			onInstall: null,
			onCancel: null,
			customCriteria: null,
			manualPrompt: null
		};

	var _defaultSession = {
		lastDisplayTime: 0, // last time we displayed the message
		returningVisitor: false, // is this the first time you visit
		displayCount: 0, // number of times the message has been shown
		optedout: false, // has the user opted out
		added: false, // has been actually added to the homescreen
		sessions: 0,
		nextSession: 0
	};

	function ath( settings ) {
		//prevent duplicate instances
		if ( !_instance ) {
			_instance = {
				trigger: trigger,
				updateSession: updateSession,
				clearSession: clearSession,
				removeSession: removeSession,
				optOut: optOut,
				optIn: optIn,
				clearDisplayCount: clearDisplayCount,
				triggerNativePrompt: triggerNativePrompt
			};

			//if no service worker then no add to homescreen
			if ( "serviceWorker" in navigator ) {
				var manifestEle = document.querySelector( "[rel='manifest']" );

				//if no manifest file then no add to homescreen
				if ( !manifestEle ) {
					console.log( "no manifest file" );
				} else {
					options = Object.assign( {}, defaults, settings );

					navigator.serviceWorker.getRegistration().then( afterSWCheck );
				}
			} else {
				writeLog( "service worker not supported" );
				writeLog(
					"Add to homescreen: not displaying callout because service workers are not supported"
				);

			}
		}

		return _instance;
	}

	function writeLog( logStr ) {
		if ( options.logging ) {

			if ( options.logger ) {
				options.logger.log( logStr );
			} else {
				console.log( logStr );
			}

		}
	}

	if ( "onbeforeinstallprompt" in window ) {
		window.addEventListener( "beforeinstallprompt", beforeInstallPrompt );

		nativePrompt = true;
	}

	if ( "onappinstalled" in window ) {
		window.addEventListener( "appinstalled", function ( evt ) {
			// TODO: update session object to reflect the PWA has been installed
			writeLog( "a2hs", "installed" );

			session.added = true;

			updateSession();

			if ( options.onInstall ) {
				options.onInstall( evt );
			}
		} );
	}

	function checkPlatform() {
		// browser info and capability
		var _ua = window.navigator.userAgent;

		platform.isIDevice = /iphone|ipod|ipad/i.test( _ua );
		platform.isSamsung = /Samsung/i.test( _ua );
		platform.isFireFox = /Firefox/i.test( _ua );
		platform.isOpera = /opr/i.test( _ua );
		platform.isEdge = /edg/i.test( _ua );

		// Opera & FireFox only Trigger on Android
		if ( platform.isFireFox ) {
			platform.isFireFox = /android/i.test( _ua );
		}

		if ( platform.isOpera ) {
			platform.isOpera = /android/i.test( _ua );
		}

		platform.isChromium = "onbeforeinstallprompt" in window;
		platform.isInWebAppiOS = window.navigator.standalone === true;
		platform.isInWebAppChrome = window.matchMedia(
			"(display-mode: standalone)"
		).matches;
		platform.isMobileSafari =
			platform.isIDevice &&
			_ua.indexOf( "Safari" ) > -1 &&
			_ua.indexOf( "CriOS" ) < 0;
		platform.isStandalone = platform.isInWebAppiOS || platform.isInWebAppChrome;
		platform.isiPad = platform.isMobileSafari && _ua.indexOf( "iPad" ) > -1;
		platform.isiPhone = platform.isMobileSafari && _ua.indexOf( "iPad" ) === -1;
		platform.isCompatible =
			platform.isChromium ||
			platform.isMobileSafari ||
			platform.isSamsung ||
			platform.isFireFox ||
			platform.isOpera ||
			platform.isIDevice;
	}

	/* displays native A2HS prompt & stores results */
	function triggerNativePrompt() {

		if ( !_beforeInstallPrompt ) {
			return Promise.resolve();
		}

		return _beforeInstallPrompt
			.prompt()
			.then( function ( evt ) {
				// Wait for the user to respond to the prompt
				return _beforeInstallPrompt.userChoice;
			} )
			.then( function ( choiceResult ) {
				session.added = choiceResult.outcome === "accepted";

				if ( session.added ) {

					writeLog( "User accepted the A2HS prompt" );

					if ( options.onAdd ) {
						options.onAdd( choiceResult );
					}

				} else {

					if ( options.onCancel ) {
						options.onCancel( choiceResult );
					}

					session.optedout = true;
					writeLog( "User dismissed the A2HS prompt" );
				}

				updateSession();

				_beforeInstallPrompt = null;
			} )
			.catch( function ( err ) {
				writeLog( err.message );

				if ( err.message.indexOf( "user gesture" ) > -1 ) {
					options.mustShowCustomPrompt = true;
					_delayedShow();
				} else if ( err.message.indexOf( "The app is already installed" ) > -1 ) {
					console.log( err.message );
					session.added = true;
					updateSession();
				} else {
					console.log( err );

					return err;
				}
			} );
	}

	function getPlatform( native ) {
		if ( options.debug && typeof options.debug === "string" ) {
			return options.debug;
		}

		if ( platform.isChromium && native === undefined && !native ) {
			return "native";
		} else if ( platform.isFireFox ) {
			return "firefox";
		} else if ( platform.isiPad ) {
			return "ipad";
		} else if ( platform.isiPhone ) {
			return "iphone";
		} else if ( platform.isOpera ) {
			return "opera";
		} else if ( platform.isSamsung ) {
			return "samsung";
		} else if ( platform.isEdge ) {
			return "edge";
		} else if ( platform.isChromium ) {
			return "chromium";
		} else {
			return "";
		}
	}

	function beforeInstallPrompt( evt ) {

		evt.preventDefault();

		console.log( "capturing the native A2HS prompt" );

		_beforeInstallPrompt = evt;

		platform.beforeInstallPrompt = evt;

	}

	function removeSession( appID ) {
		localStorage.removeItem( appID || ath.defaults.appID );
	}

	platform.cancelPrompt = function ( evt ) {
		evt.preventDefault();

		if ( options.onCancel ) {
			options.onCancel();
		}

		return false;
	};

	platform.handleInstall = function ( evt ) {
		if ( options.onInstall ) {
			options.onInstall( evt );
		}

		if (
			_beforeInstallPrompt &&
			( !options.debug || getPlatform() === "native" )
		) {

			triggerNativePrompt();
		}

		return false;
	};

	function afterSWCheck( sw ) {
		_instance.sw = sw;

		if ( !_instance.sw ) {
			console.log( "no service worker" );
			platform.isCompatible = false;
			//return, no need to go further
			return;
		}

		session = JSON.parse( localStorage.getItem( options.appID ) );

		if ( !session ) {
			session = _defaultSession;
		}

		if ( typeof session === "string" ) {
			session = JSON.parse( session );
		}

		session.sessions += 1;
		updateSession();

		checkPlatform();

		// override defaults that are dependent on each other
		if ( options && options.debug && typeof options.logging === "undefined" ) {
			options.logging = true;
		}

		// normalize some options
		options.mandatory =
			options.mandatory && ( "standalone" in window.navigator || options.debug );

		//this is forcing the user to add to homescreen before anything can be done
		//the ideal scenario for this would be an enterprise business application
		//could also be a part of an onboarding workflow for a SAAS
		options.modal = options.modal || options.mandatory;

		if ( options.mandatory ) {
			options.startDelay = -0.5; // make the popup hasty
		}

		// setup the debug environment
		if ( options.debug ) {
			platform.isCompatible = true;
		}

		if ( options.onInit ) {
			options.onInit( _instance );
		}

		if ( options.autostart ) {
			writeLog( "Add to homescreen: autostart displaying callout" );

			show();
		} else if ( !nativePrompt ) {
			show();
		} else {
			_show();
		}
	}

	function passCustomCriteria() {

		if (
			options.customCriteria !== null ||
			options.customCriteria !== undefined
		) {
			var passCustom = false;

			if ( typeof options.customCriteria === "function" ) {
				passCustom = options.customCriteria();
			} else {
				passCustom = !!options.customCriteria;
			}

			options.customCriteria = passCustom;

			if ( !passCustom ) {
				writeLog(
					"Add to homescreen: not displaying callout because a custom criteria was not met."
				);
			}

			return passCustom;
		}

		return options.customCriteria;
	}

	function canInstall() {

		//already evaluated the situation, so don't do it again
		if ( _canInstall !== undefined ) {
			return _canInstall;
		}

		_canInstall = false;

		_instance.beforeInstallPrompt = "onbeforeinstallprompt" in window;

		if ( !passCustomCriteria() ) {
			_canInstall = false;
			return false;
		}

		if ( !session.optedout && !session.added &&
			!platform.isStandalone && platform.isCompatible ) {
			_canInstall = true;
			return true;
		}

		return _canInstall;

	}

	//performs various checks to see if we are cleared for prompting
	function canPrompt() {
		//already evaluated the situation, so don't do it again
		if ( _canPrompt !== undefined ) {
			return _canPrompt;
		}

		_canPrompt = false;

		if ( !passCustomCriteria() ) {
			_canInstall = false;
			return false;
		}

		// the device is not supported
		if ( !platform.isCompatible ) {
			writeLog(
				"Add to homescreen: not displaying callout because device not supported"
			);
			return false;
		}

		var now = Date.now(),
			lastDisplayTime = session.lastDisplayTime;

		// we obey the display pace (prevent the message to popup too often)
		if ( now - lastDisplayTime < options.displayPace * 60000 ) {
			writeLog(
				"Add to homescreen: not displaying callout because displayed recently"
			);
			return false;
		}

		// obey the maximum number of display count
		if (
			options.maxDisplayCount &&
			session.displayCount >= options.maxDisplayCount
		) {
			writeLog(
				"Add to homescreen: not displaying callout because displayed too many times already"
			);
			return false;
		}

		if ( session.sessions < options.minSessions ) {
			writeLog(
				"Add to homescreen: not displaying callout because not enough visits"
			);
			return false;
		}

		if (
			options.nextSession &&
			options.nextSession > 0 &&
			session.sessions >= options.nextSession
		) {
			writeLog(
				"Add to homescreen: not displaying callout because waiting on session " +
				options.nextSession
			);
			return false;
		}

		// critical errors:
		if ( session.optedout ) {
			writeLog(
				"Add to homescreen: not displaying callout because user opted out"
			);
			return false;
		}

		if ( session.added ) {
			writeLog(
				"Add to homescreen: not displaying callout because already added to the homescreen"
			);
			return false;
		}

		// check if the app is in stand alone mode
		//this applies to iOS
		if ( platform.isStandalone ) {
			// execute the onAdd event if we haven't already
			if ( !session.added ) {
				session.added = true;
				updateSession();

				if ( options.onAdd ) {
					options.onAdd( _instance, session );
				}
			}

			writeLog(
				"Add to homescreen: not displaying callout because in standalone mode"
			);
			return false;
		}

		// check if this is a returning visitor
		if ( !session.returningVisitor ) {
			session.returningVisitor = true;
			updateSession();

			// we do not show the message if this is your first visit
			if ( options.skipFirstVisit ) {
				writeLog(
					"Add to homescreen: not displaying callout because skipping first visit"
				);
				return false;
			}
		}

		_canPrompt = true;

		console.log( "end canPrompt" );

		return true;
	}

	function show( force ) {
		// message already on screen
		if ( session.shown && !force ) {
			writeLog(
				"Add to homescreen: not displaying callout because already shown on screen"
			);
			return;
		}

		session.shown = true;

		if (
			document.readyState === "interactive" ||
			document.readyState === "complete"
		) {
			_delayedShow();
		} else {
			document.onreadystatechange = function () {
				if ( document.readyState === "complete" ) {
					_delayedShow();
				}
			};
		}
	}

	function _delayedShow( e ) {
		setTimeout( _show(), options.startDelay * 1000 + 500 );
	}

	function _show() {

		if ( canPrompt() ) {

			_instance.beforeInstallPrompt = "onbeforeinstallprompt" in window;

			// fire the custom onShow event
			if ( options.onShow ) {
				options.onShow( platform, session, _instance );
			}

			// increment the display count
			session.lastDisplayTime = Date.now();
			session.displayCount++;

			updateSession();

		} else if ( canInstall() ) {
			// fire the custom onShow event
			if ( options.onCanInstall ) {
				options.onCanInstall( platform, session, _instance );
			}

		}
	}

	function trigger() {
		_show();
	}

	function updateSession() {
		localStorage.setItem( options.appID, JSON.stringify( session ) );
	}

	function clearSession() {
		session = _defaultSession;
		updateSession();
	}

	function optOut() {
		session.optedout = true;
		updateSession();
	}

	function optIn() {
		session.optedout = false;
		updateSession();
	}

	function clearDisplayCount() {
		session.displayCount = 0;
		updateSession();
	}

	// expose to the world
	window.addToHomescreen = ath;
} )( window, document );