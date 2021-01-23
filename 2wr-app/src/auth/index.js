import Vue from "vue";
import createAuth0Client from "@auth0/auth0-spa-js";

/** Define a default action to perform after authentication */
const DEFAULT_REDIRECT_CALLBACK = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  }

let instance;

/** Returns the current instance of the SDK */
export const getAuthInstance = () => instance;

/** Creates an instance of the Auth0 SDK. If one has already been created, it returns that instance */
export const useAuth0 = ({
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  redirectUri = window.location.origin,
  ...options
}) => {
  if (instance) return instance;

  // The 'instance' is simply a Vue object
  instance = new Vue({
    data() {
      return {
        loading: true,
        isAuthenticated: false,
        user: {},
        auth0Client: null,
        popupOpen: false,
        error: null
      };
    },
    methods: {
      /** Authenticates the user using a popup window */
      async loginWithPopup(o) {
        this.popupOpen = true;

        try {
          await this.auth0Client.loginWithPopup(o);
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        } finally {
          this.popupOpen = false;
        }

        this.user = await this.auth0Client.getUser();
        this.isAuthenticated = true;
      },
      /** Handles the callback when logging in using a redirect */
      async handleRedirectCallback() {
        this.loading = true;
        try {
          await this.auth0Client.handleRedirectCallback();
          this.user = await this.auth0Client.getUser();
          this.isAuthenticated = true;
        } catch (e) {
          this.error = e;
        } finally {
          this.loading = false;
        }
      },
      /** Authenticates the user using the redirect method */
      loginWithRedirect(routePath) {
        let options = {};
        if (routePath) {
         options.appState = {
            targetUrl: routePath
          }
        }
        return this.auth0ClientPromise.then((client) => client.loginWithRedirect(options));
      },
      /** Returns all the claims present in the ID token */
      getIdTokenClaims(o) {
        return this.auth0ClientPromise.then((client) => client.getIdTokenClaims(o));
      },
      /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
      getTokenSilently(o) {
        return this.auth0ClientPromise.then((client) => client.getTokenSilently(o));
      },
      /** Gets the access token using a popup window */

      getTokenWithPopup(o) {
        return this.auth0ClientPromise.then((client) => client.getTokenWithPopup(o));
      },
      /** Logs the user out and removes their session on the authorization server */
      logout(o) {
        return this.auth0ClientPromise.then((client) => client.logout(o));
      },
      getIsAuthenticated() {
        return this.auth0ClientPromise.then((client) => client.isAuthenticated());
      }
    },
    /** Use this lifecycle method to instantiate the SDK client */
    async created() {
      // Create a new instance of the SDK client using members of the given options object
      this.auth0ClientPromise = createAuth0Client({
        domain: options.domain,
        client_id: options.clientId,
        cacheLocation: 'localstorage',
        responseType: 'token id_token access_token',
        scope: 'openid profile api',
        audience: options.audience,
        redirect_uri: redirectUri
      });
      this.auth0Client = await this.auth0ClientPromise;

      try {
        // If the user is returning to the app after authentication..
        if (
          window.location.search.includes("code=") &&
          window.location.search.includes("state=")
        ) {
          // handle the redirect and retrieve tokens
          const { appState } = await this.auth0Client.handleRedirectCallback();
          console.log(appState);
          // Notify subscribers that the redirect callback has happened, passing the appState
          // (useful for retrieving any pre-authentication state)
          onRedirectCallback(appState);
        }
      } catch (e) {
        this.error = e;
      } finally {
        // Initialize our internal authentication state
        this.isAuthenticated = await this.auth0Client.isAuthenticated();
        this.user = await this.auth0Client.getUser();
        this.loading = false;
      }
    }
  });

  return instance;
};

// Create a simple Vue plugin to expose the wrapper object throughout the application
export const Auth0Plugin = {
  install(Vue, options) {
    Vue.prototype.$auth = useAuth0(options);
  }
};
