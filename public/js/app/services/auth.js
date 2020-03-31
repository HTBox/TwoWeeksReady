( function () {

    "use strict";

    gvtc.utils.nameSpace( "gvtc.auth" );

    var ACCESS_TOKEN = "access_token",
        REFRESH_TOKEN = "refresh_token",
        ID_TOKEN = "id_token",
        token_expires = "token_expires",
        cognitoGroups = "cognito:groups",
        USER_ATTRIBUTES = "user-attributes",
        USER_DATA_KEY = "user-data",
        USER_PROFILE = "-user-profile",
        api_url = "",
        _userPool, _cognitoUser, _authDetails;

    /*
    TODO: region & clientId should come from configuration
        really should be part of a configuration object rendered & loaded
        that identifies the application
    */

    var region = "us-east-1",
        ClientId = "g3s9sel4at838a6uv53pt2c14",
        cognitoEndpoint = "https://cognito-idp." + region + ".amazonaws.com/",
        awsTarget = "AWSCognitoIdentityProviderService.",
        amznContentType = "application/x-amz-json-1.1",
        amznTarget = "X-Amz-Target",
        initiateAuth = "InitiateAuth",
        TokenType = "Bearer";

    /*
        var userData = {
            Username: username,
            Pool: userPool
        };
    */

    var cognitoConfig = {
        method: "POST",
        mode: "cors",
        cache: 'no-cache',
        headers: {
            "Content-Type": amznContentType,
            amznTarget: ""
        }
    };

    function loginUser( username, password ) {

        var config = cognitoConfig;

        config.headers[ amznTarget ] = awsTarget + initiateAuth;

        config.body = JSON.stringify( {
            "AuthFlow": "USER_PASSWORD_AUTH",
            "AuthParameters": {
                "USERNAME": username,
                "PASSWORD": password
            },
            "ClientId": ClientId,
            "ClientMetadata": {}
        } );

        return fetch( cognitoEndpoint, config )
            .then( function ( response ) {

                if ( response.status === 400 ||
                    response.status === 403 ) {

                    return response.json()
                        .then( function ( err ) {

                            err.status = err.status || response.status;

                            throw err;
                        } );

                } else if ( response.ok ) {

                    return response.json();

                }

            } )
            .then( function ( tokens ) {

                if ( tokens.AuthenticationResult ) {

                    return saveAuthTokens( tokens );

                } else {

                    throw tokens;

                }

            } )
            .then( function ( token ) {

                return decodeJWT( token );

            } );

    }

    function refreshTokens() {

        return getRefreshToken()
            .then( function ( token ) {

                if ( !token ) {

                    throw {
                        message: "no refresh token"
                    };

                }

                var config = cognitoConfig;

                config.headers[ amznTarget ] = awsTarget + initiateAuth;

                config.body = JSON.stringify( {
                    "AuthFlow": "REFRESH_TOKEN_AUTH",
                    "AuthParameters": {
                        DEVICE_KEY: null,
                        REFRESH_TOKEN: token
                    },
                    "ClientId": ClientId
                } );

                return fetch( cognitoEndpoint, config );

            } )
            .then( function ( response ) {

                if ( response.ok ) {

                    if ( response.status === 400 ||
                        response.status === 403 ) {

                        throw {
                            message: "not authorized",
                            status: response.status
                        };
                    }

                    return response.json();

                } else {

                    throw {
                        message: "authentication error",
                        status: response.status
                    };

                }

            } )
            .then( function ( tokens ) {

                return saveAuthTokens( tokens );

            } );

    }

    function getRefreshToken() {
        return localforage.getItem( REFRESH_TOKEN );
    }

    function getIdToken() {
        return localforage.getItem( ID_TOKEN );
    }

    function getAccessToken() {
        return localforage.getItem( ACCESS_TOKEN );
    }

    function saveAuthTokens( tokens ) {

        tokens = tokens.AuthenticationResult;

        var saves = [];

        saves.push( localforage.setItem( ID_TOKEN, tokens.IdToken ) );

        if ( tokens.RefreshToken ) {
            saves.push( localforage.setItem( REFRESH_TOKEN, tokens.RefreshToken ) );
        }

        saves.push( localforage.setItem( ACCESS_TOKEN, tokens.AccessToken ) );

        var expires = new Date();

        expires.setSeconds( tokens.ExpiresIn );

        saves.push( localforage.setItem( token_expires, expires ) );

        return Promise.all( saves )
            .then( function () {

                return tokens.IdToken;
            } );

    }

    function completeNewPasswordChallenge( newPassword, challenge, requiredValues ) {

        if ( !newPassword ) {
            return Promise.reject( new Error( 'New password is required.' ) );
        }

        var config = cognitoConfig,
            requiredAttributeData = challenge.ChallengeParameters.requiredAttributes,
            userAttributes = challenge.ChallengeParameters.userAttributes,
            finalUserAttributes = {};

        if ( typeof userAttributes === "string" ) {
            userAttributes = JSON.parse( userAttributes );
        }

        if ( typeof requiredAttributeData === "string" ) {
            requiredAttributeData = JSON.parse( requiredAttributeData );
        }

        if ( requiredAttributeData ) {

            for ( var index = 0; index < requiredAttributeData.length; index++ ) {

                requiredAttributeData[ index ] =
                    requiredAttributeData[ index ].replace( "userAttributes.", "" );

            }

        }

        finalUserAttributes[ "userAttributes.given_name" ] = requiredValues.given_name;
        finalUserAttributes[ "userAttributes.family_name" ] = requiredValues.family_name;
        finalUserAttributes.NEW_PASSWORD = newPassword;
        finalUserAttributes.USERNAME = challenge.ChallengeParameters.USER_ID_FOR_SRP;

        config.headers[ amznTarget ] = awsTarget + "RespondToAuthChallenge";

        config.body = JSON.stringify( {
            ChallengeName: "NEW_PASSWORD_REQUIRED",
            ClientId: ClientId,
            ChallengeResponses: finalUserAttributes,
            Session: challenge.Session
        } );

        return fetch( cognitoEndpoint, config )
            .then( function ( response ) {

                if ( response.status === 400 ||
                    response.status === 403 ) {

                    response.json()
                        .then( function ( err ) {

                            err.status = err.status || response.status;

                            throw err;
                        } );

                } else if ( response.ok ) {

                    return response.json();

                } else {

                    throw response.status;
                }

            } )
            .then( function ( tokens ) {

                return saveAuthTokens( tokens );

            } )
            .then( function ( token ) {

                return decodeJWT( token );

            } );

    }

    function decodeJWT( jwt ) {

        if ( jwt === "" ) {
            return "";
        }

        if ( typeof jwt === "object" && jwt.token ) {
            jwt = jwt.token;
        }

        var segments = jwt.split( '.' ),
            header, content;

        if ( segments.length != 3 ) {
            throw "JWT is required to have three segments";
        }

        //        header = base64URLDecode( segments[ 0 ] );
        content = base64URLDecode( segments[ 1 ] );
        //signature = auth.base64URLDecode(segments[2]);

        return content;

    }

    function setCognitoGroups( value ) {

        return localforage.setItem( cognitoGroups,
            value );

    }

    function getCognitoGroups() {

        return localforage.getItem( cognitoGroups );

    }

    function setUserAttributes( value ) {

        return localforage.setItem( USER_ATTRIBUTES,
            value );

    }

    function getUserAttributes() {

        return localforage.getItem( USER_ATTRIBUTES );

    }

    function base64URLDecode( base64UrlEncodedValue ) {

        var result,
            newValue = base64UrlEncodedValue
            .replace( "-", "+" )
            .replace( "_", "/" );

        try {

            result = decodeURIComponent( escape( atob( newValue ) ) );

        } catch ( e ) {
            throw "Base64URL decode of JWT segment failed";
        }

        return JSON.parse( result );
    }

    function signOut() {

        var saves = [];

        saves.push( localforage.removeItem( ID_TOKEN ) );
        saves.push( localforage.removeItem( ACCESS_TOKEN ) );
        saves.push( localforage.removeItem( REFRESH_TOKEN ) );
        saves.push( localforage.removeItem( token_expires ) );
        saves.push( localforage.removeItem( USER_PROFILE ) );

        return Promise.all( saves )
            .then( function () {
                window.location.href = "../login/";
            } );

    }

    function changePassword( oldUserPassword, newUserPassword ) {

        var resp,
            responseJsonData;

        updateAuthentication()
            .then( function ( auth ) {

                //access Token
                return getAccessToken();

            } )
            .then( function ( token ) {

                var config = cognitoConfig;

                config.headers[ amznTarget ] = awsTarget + "ChangePassword";

                config.body = JSON.stringify( {
                    PreviousPassword: oldUserPassword,
                    ProposedPassword: newUserPassword,
                    AccessToken: token
                } );

                return fetch( cognitoEndpoint, config )
                    .then( function ( response ) {

                        resp = response;

                        if ( response.ok ) {

                            if ( response.status === 400 ||
                                response.status === 403 ) {
                                window.location.href = "../login/";
                            }

                            return response.json();

                        }

                    } )
                    .then( function ( tokens ) {

                        return saveAuthTokens( tokens );

                    } )
                    .then( function ( token ) {

                        return decodeJWT( token );

                    } );

            } )
            .catch( function ( error ) {

                return signOut();

            } );

    }

    function updateAuthentication() {

        isAuthenticated()
            .then( function ( auth ) {

                if ( !auth ) {

                    return refreshTokens();

                }

                return true;

            } );

    }

    function isAuthenticated() {

        return getIdToken()
            .then( function ( token ) {

                return localforage.getItem( token_expires )
                    .then( function ( expires ) {

                        if ( !expires ) {
                            return false;
                        }

                        if ( expires < new Date() ) {

                            return false;

                        } else {

                            return !!token;

                        }

                    } );

            } );

    }

    function recoverPassword( username ) {

        var config = cognitoConfig;

        config.headers[ amznTarget ] = awsTarget + "ForgotPassword";

        var body = {
            ClientId: ClientId,
            Username: username
        };

        config.body = JSON.stringify( body );

        return fetch( cognitoEndpoint, config )
            .then( function ( response ) {

                if ( response.ok ) {

                    return response.json();

                } else {
                    throw response.status;
                }

            } );

    }

    function confirmPassword( options ) {

        var config = cognitoConfig;

        config.headers[ amznTarget ] = awsTarget + "ConfirmForgotPassword";

        config.body = JSON.stringify( {
            ClientId: options.ClientId || ClientId,
            Username: options.username,
            ConfirmationCode: options.confirmationCode,
            Password: options.newPassword
        } );

        return fetch( cognitoEndpoint, config )
            .then( function ( response ) {

                if ( response.ok ) {

                    return response.json();

                } else {
                    throw response.status;
                }

            } );

    }

    /**
     * This is used for a certain user to confirm the registration by using a confirmation code
     * @param {options} options Object containing the following properties:
     * @param {string} confirmationCode Code entered by user.
     * @param {bool} forceAliasCreation Allow migrating from an existing email / phone number.
     * @returns {Promise}
     */
    function confirmRegistration( options ) {

        var config = cognitoConfig;

        config.headers[ amznTarget ] = awsTarget + "ConfirmSignUp";

        config.body = JSON.stringify( {
            ClientId: options.ClientId || ClientId,
            Username: options.username,
            ConfirmationCode: options.confirmationCode,
            ForceAliasCreation: options.forceAliasCreation || false
        } );

        return fetch( cognitoEndpoint, config )
            .then( function ( response ) {

                if ( response.ok ) {

                    return response.json();

                } else {

                    return response.json()
                        .then( function ( message ) {

                            throw {
                                "status": response.status,
                                "message": message
                            }

                        } );

                }

            } );

    }

    function resendConfirmationCode( options ) {

        var config = cognitoConfig;

        config.headers[ amznTarget ] = awsTarget + "ResendConfirmationCode";

        config.body = JSON.stringify( {
            ClientId: options.ClientId || ClientId,
            Username: options.username
        } );

        return fetch( cognitoEndpoint, config )
            .then( function ( response ) {

                if ( response.ok ) {

                    return response.json();

                } else {
                    throw response.status;
                }

            } );

    }

    function forgotPassword( options ) {

        var config = cognitoConfig;

        config.headers[ amznTarget ] = awsTarget + "ForgotPassword";

        config.body = JSON.stringify( {
            ClientId: options.ClientId || ClientId,
            Username: options.username
        } );

        return fetch( cognitoEndpoint, config )
            .then( function ( response ) {

                if ( response.ok ) {

                    return response.json();

                } else {
                    throw response.status;
                }

            } );

    }

    function createUser( options ) {

        var config = cognitoConfig,
            userAttributes = [ {
                Name: "email",
                Value: options.email,
            } ];

        if ( options.phone ) {
            userAttributes.push( {
                Name: "phone_number",
                Value: options.phone,
            } );
        }

        if ( options.first_name || options.given_name ) {
            userAttributes.push( {
                Name: "given_name",
                Value: options.first_name || options.given_name,
            } );
        }

        if ( options.last_name || options.family_name ) {
            userAttributes.push( {
                Name: "family_name",
                Value: options.last_name || options.family_name,
            } );
        }

        config.headers[ amznTarget ] = awsTarget + "SignUp";

        config.body = JSON.stringify( {
            ClientId: options.ClientId || ClientId,
            Username: options.username,
            Password: options.password,
            UserAttributes: userAttributes
        } );

        return fetch( cognitoEndpoint, config )
            .then( function ( response ) {

                if ( response.ok ) {

                    return response.json();

                } else {
                    throw response.status;
                }

            } )
            .then( function ( cognito_data ) {

                //post to OMP API to create user
                /*
                                return fetch( api_url + "user/", {
                                    mode: "cors",
                                    method: "POST",
                                    body: JSON.stringify( {
                                        given_name: options.given_name,
                                        family_name: options.family_name,
                                        email: options.email,
                                        company_name: options.company_name,
                                        Username: options.username,
                                        Password: options.password,
                                        UserAttributes: options.userAttributes,
                                        groups: options.groups
                                    } )
                                } );
                */
            } );

    }

    function saveUserData( userData ) {

        return localforage.setItem( USER_DATA_KEY, userData );

    }

    function getUserData( forceUpdate ) {

        return localforage.getItem( USER_DATA_KEY )
            .then( function ( userData ) {

                if ( !forceUpdate && userData ) {
                    return userData;
                } else {

                    return getAccessToken()
                        .then( function ( ACCESS_TOKEN ) {

                            var config = cognitoConfig;

                            config.headers[ amznTarget ] = awsTarget + "GetUser";

                            config.body = JSON.stringify( {
                                "AccessToken": ACCESS_TOKEN
                            } );

                            return fetch( cognitoEndpoint, config )
                                .then( function ( response ) {

                                    if ( response.ok ) {

                                        if ( response.status === 400 ||
                                            response.status === 403 ) {
                                            window.location.href = "login/";
                                        }

                                        return response.json();

                                    }

                                } )
                                .then( function ( userData ) {

                                    return saveUserData( userData )
                                        .then( function () {
                                            return userData;
                                        } );

                                } );

                        } );

                }

            } );

    }

    function getUserTennantId() {

        return getUserData()
            .then( function ( userData ) {

                var tennantId = "";

                for ( var index = 0; index < userData.UserAttributes.length; index++ ) {

                    var attribute = userData.UserAttributes[ index ];

                    if ( attribute.Name === "custom:tennantId" ) {

                        tennantId = attribute.Value;
                        index = userData.UserAttributes.length;
                    }

                }

                return tennantId;

            } );
    }

    function belongsToRole( role ) {

        return getUserAttributes()
            .then( function ( attributes ) {

                return ( attributes[ "cognito:groups" ].indexOf( role ) > -1 );

            } );

    }

    function isUserAuthorized( roles ) {

        if ( !roles || !Array.isArray( roles ) ) {
            return Promise.reject( "not authorized" );
        }

        return getUserAttributes()
            .then( function ( attributes ) {

                return attributes[ "cognito:groups" ]
                    .filter( function ( role ) {

                        return roles.indexOf( role ) > -1;
                    } );

            } );

    }

    gvtc.auth = {

        loginUser: loginUser,
        signOut: signOut,
        refreshTokens: refreshTokens,

        changePassword: changePassword,

        recoverPassword: recoverPassword,

        confirmPassword: confirmPassword,

        confirmRegistration: confirmRegistration,

        getRefreshToken: getRefreshToken,

        getAccessToken: getAccessToken,

        getIdToken: getIdToken,

        getUserTennantId: getUserTennantId,

        setCognitoGroups: setCognitoGroups,
        getCognitoGroups: getCognitoGroups,

        setUserAttributes: setUserAttributes,
        getUserAttributes: getUserAttributes,

        belongsToRole: belongsToRole,

        resendConfirmationCode: resendConfirmationCode,
        forgotPassword: forgotPassword,

        completeNewPasswordChallenge: completeNewPasswordChallenge,

        createUser: createUser,

        getUserData: getUserData,

        saveUserData: saveUserData,

        isAuthenticated: isAuthenticated,

        isUserAuthorized: isUserAuthorized

    };

}() );