( function () {

    "use strict";

    gvtc.utils.nameSpace( "gvtc.user_data" );

    var apiURL = "user-profile-3.json";

    var USER_PROFILE = "-user-profile",
        MAX_LIST_CACHE = 15;

    //MESSAGE
    function getMessage( options ) {

        if ( !options && ( !options.id ) ) {

            return Promise.reject( "no valid message selection criteria supplied" );

        }

        return getMessages( options )
            .then( function ( user_data ) {

                for ( var index = 0; index < user_data.length; index++ ) {

                    var message = user_data[ index ];

                    if ( options.id === message.assetId ) {

                        return message;

                    }
                }

            } );

    }

    function getMessages( options ) {

        return getUserProfileData()
            .then( function ( data ) {

                if ( data ) {
                    return data.ContactRequests;
                }

            } );

    }

    function getActiveMessageCount() {

        return getMessages()
            .then( function ( messages ) {

                var count = 0;

                if ( !messages ) {
                    return count;
                }

                for ( var index = 0; index < messages.length; index++ ) {

                    if ( messages[ index ].IsActive ) {
                        count++;
                    }

                }

                return count;

            } );

    }

    function postMessage( message ) {

        if ( !message ) {
            return Promise.reject( "no message object supplied" );
        }

        message.date_updated = new Date().toISOString();

        message.assetType = "message";

        // return gvtc.http.authorized( {
        //         "method": "POST",
        //         "mode": "cors",
        //         "url": gvtc.apiURLBase + apiURL + "?tennantId=" + employee.tennantId,
        //         "body": JSON.stringify( employee )
        //     } )
        //     .then( function ( response ) {

        //         if ( response.ok ) {

        //             return response.json();

        //         }

        //         //could postMessage to service worker to update cached list here
        //     } )
        //     .then( function () {

        //         return getMessage( {
        //             "forceUpdate": true,
        //             "tennantId": employee.tennantId
        //         } );
        //     } );

        return Promise.resolve();

    }

    function deleteMessage( options ) {

        if ( options.id ) {

            // return gvtc.http.authorized( {
            //         "method": "DELETE",
            //         "mode": "cors",
            //         "url": gvtc.apiURLBase + apiURL + "?id=" + options.id +
            //             "&tennantId=" + options.tennantId
            //     } )
            //     .then( function ( response ) {

            //         if ( response.ok ) {

            //             return response.json();

            //         }

            //     } )
            //     .then( function () {

            //         return updateLocaluser_data( options.tennantId );

            //     } );

            return Promise.resolve();

        } else {

            return Promise.reject( "missing Message Id" );

        }

    }

    //PROFILE
    function getProfile( options ) {

        if ( !options && ( !options.id ) ) {

            return Promise.reject( "no valid message selection criteria supplied" );

        }

        return getUserProfileData( options )
            .then( function ( user_data ) {

                return user_data.Profile;

            } );

    }

    /* update the profile */
    function postProfile( profile ) {

        if ( !profile ) {
            return Promise.reject( "no profile object supplied" );
        }

        profile.date_updated = new Date().toISOString();

        profile.assetType = "message";

        // return gvtc.http.authorized( {
        //         "method": "POST",
        //         "mode": "cors",
        //         "url": gvtc.apiURLBase + apiURL + "?tennantId=" + employee.tennantId,
        //         "body": JSON.stringify( employee )
        //     } )
        //     .then( function ( response ) {

        //         if ( response.ok ) {

        //             return response.json();

        //         }

        //         //could postMessage to service worker to update cached list here
        //     } )
        //     .then( function () {

        //         return getMessage( {
        //             "forceUpdate": true,
        //             "tennantId": employee.tennantId
        //         } );
        //     } );

        return Promise.resolve();

    }


    function getUserProfileData() {

        return gvtc.data
            .getItems( {}, "api/" + apiURL, USER_PROFILE );

    }

    // Request Issues
    function getRequestIssue( options ) {

        if ( !options && ( !options.id ) ) {

            return Promise.reject( "no valid Request Issue selection criteria supplied" );

        }

        return getRequestIssues( options )
            .then( function ( issues ) {

                for ( var index = 0; index < issues.length; index++ ) {

                    var issue = issues[ index ];

                    if ( options.id === issue.RequestIssueId ) {

                        return issue;

                    }
                }

            } );

    }

    function getRequestIssues( options ) {

        return getUserProfileData()
            .then( function ( data ) {

                if ( data ) {
                    return data.Data.RequestIssues;
                }

            } );

    }

    function getRequestIssueCount() {

        return getRequestIssues()
            .then( function ( issues ) {

                var count = 0;

                if ( !issues ) {
                    return count;
                }

                for ( var index = 0; index < issues.length; index++ ) {

                    if ( issues[ index ].IsActive ) {
                        count++;
                    }

                }

                return count;

            } );

    }

    function postRequestIssue( issue ) {

        if ( !issue ) {
            return Promise.reject( "no request issue object supplied" );
        }

        message.date_updated = new Date().toISOString();

        message.assetType = "request-issue";

        // return gvtc.http.authorized( {
        //         "method": "POST",
        //         "mode": "cors",
        //         "url": gvtc.apiURLBase + apiURL + "?tennantId=" + employee.tennantId,
        //         "body": JSON.stringify( employee )
        //     } )
        //     .then( function ( response ) {

        //         if ( response.ok ) {

        //             return response.json();

        //         }

        //         //could postMessage to service worker to update cached list here
        //     } )
        //     .then( function () {

        //         return getMessage( {
        //             "forceUpdate": true,
        //             "tennantId": employee.tennantId
        //         } );
        //     } );

        return Promise.resolve();

    }

    function deleteRequestIssue( options ) {

        if ( options.id ) {

            // return gvtc.http.authorized( {
            //         "method": "DELETE",
            //         "mode": "cors",
            //         "url": gvtc.apiURLBase + apiURL + "?id=" + options.id +
            //             "&tennantId=" + options.tennantId
            //     } )
            //     .then( function ( response ) {

            //         if ( response.ok ) {

            //             return response.json();

            //         }

            //     } )
            //     .then( function () {

            //         return updateLocaluser_data( options.tennantId );

            //     } );

            return Promise.resolve();

        } else {

            return Promise.reject( "missing Request Issue Id" );

        }

    }

    // Service Requests
    function getServiceRequest( options ) {

        if ( !options && ( !options.id ) ) {

            return Promise.reject( "no valid Service Requests selection criteria supplied" );

        }

        return getServiceRequests( options )
            .then( function ( issues ) {

                for ( var index = 0; index < issues.length; index++ ) {

                    var issue = issues[ index ];

                    if ( options.id === issue.RecordId ) {

                        return issue;

                    }
                }

            } );

    }

    function getServiceRequests( options ) {

        return getUserProfileData()
            .then( function ( data ) {

                if ( data ) {
                    return data.Data.ServiceRequests;
                }

            } );

    }

    function getServiceRequestCount() {

        return ServiceRequests()
            .then( function ( issues ) {

                var count = 0;

                if ( !issues ) {
                    return count;
                }

                for ( var index = 0; index < issues.length; index++ ) {

                    if ( issues[ index ].IsActive ) {
                        count++;
                    }

                }

                return count;

            } );

    }

    function postServiceRequest( issue ) {

        if ( !issue ) {
            return Promise.reject( "no request issue object supplied" );
        }

        message.date_updated = new Date().toISOString();

        message.assetType = "service-request";

        // return gvtc.http.authorized( {
        //         "method": "POST",
        //         "mode": "cors",
        //         "url": gvtc.apiURLBase + apiURL + "?tennantId=" + employee.tennantId,
        //         "body": JSON.stringify( employee )
        //     } )
        //     .then( function ( response ) {

        //         if ( response.ok ) {

        //             return response.json();

        //         }

        //         //could postMessage to service worker to update cached list here
        //     } )
        //     .then( function () {

        //         return getMessage( {
        //             "forceUpdate": true,
        //             "tennantId": employee.tennantId
        //         } );
        //     } );

        return Promise.resolve();

    }

    function deleteServiceRequest( options ) {

        if ( options.id ) {

            // return gvtc.http.authorized( {
            //         "method": "DELETE",
            //         "mode": "cors",
            //         "url": gvtc.apiURLBase + apiURL + "?id=" + options.id +
            //             "&tennantId=" + options.tennantId
            //     } )
            //     .then( function ( response ) {

            //         if ( response.ok ) {

            //             return response.json();

            //         }

            //     } )
            //     .then( function () {

            //         return updateLocaluser_data( options.tennantId );

            //     } );

            return Promise.resolve();

        } else {

            return Promise.reject( "missing Request Issue Id" );

        }

    }


    gvtc.user_data = {

        getMessage: getMessage,

        getMessages: getMessages,

        postMessage: postMessage,

        deleteMessage: deleteMessage,

        getUserProfileData: getUserProfileData,

        getActiveMessageCount: getActiveMessageCount,

        getServiceRequest: getServiceRequest,

        getServiceRequests: getServiceRequests,

        getRequestIssue: getRequestIssue,

        getRequestIssues: getRequestIssues,

        getRequestIssueCount: getRequestIssueCount

    };

}() );