const family = require( "./family" ),
    family_member = require( "./family_member" ),
    feed = require( "./feed" ),
    contact = require( "./contact" ),
    helpers = require( "./libs/helpers" );

/* Groups Go Here */

function NotAuthorizedResponse( callback ) {

    helpers.httpRespond( helpers.stringify( {
        error: "you are not authorized to execute this command"
    } ), callback, 403 );

}

function handleReject( err, callback ) {

    helpers.httpRespond( err, callback, err.statusCode || err.status || 500 );

}

function handleRequest( promise, data, body, callback, authorization ) {

    if ( authorization ) {

        let auth = helpers.belongsToCognitoGroup( data.headers, authorization );

        if ( !auth ) {

            return NotAuthorizedResponse( callback );

        }

    }

    return promise( body )
        .then( function ( ret ) {

            try {

                if ( ret && ret.statusCode && ret.statusCode !== 200 ) {
                    helpers.httpRespond( ret.body, callback, ret.statusCode );
                } else {

                    helpers.OK( ret, callback );

                }

            } catch ( err ) {

                throw err;
            }

        } )
        .catch( function ( err ) {

            handleReject( err, callback );

        } );

}

/* start family */

exports.twodaysready_family_delete = function ( data, context, callback ) {

    handleRequest( family.deleteFamily,
        data, data.queryStringParameters.id, callback );

};

exports.twodaysready_family_get = function ( data, context, callback ) {

    if ( data.queryStringParameters && data.queryStringParameters.id &&
        data.queryStringParameters.id !== "" ) {

        handleRequest( family.getFamily, data, data.queryStringParameters.id, callback );

    } else {

        handleRequest( family.getFamilies, data, data.queryStringParameters, callback );

    }

};

exports.twodaysready_family_update = function ( data, context, callback ) {

    handleRequest( family.saveFamily,
        data, helpers.parse( data.body ), callback );

};

/* end family */

/* start family members */

exports.twodaysready_family_member_delete = function ( data, context, callback ) {

    handleRequest( family_member.deleteFamilyMember,
        data, data.queryStringParameters.id, callback );

};

exports.twodaysready_family_member_get = function ( data, context, callback ) {

    if ( data.queryStringParameters && data.queryStringParameters.id &&
        data.queryStringParameters.id !== "" ) {

        handleRequest( family_member.getFamilyMember, data, data.queryStringParameters.id, callback );

    } else {

        handleRequest( family_member.getFamilyMembers, data, data.queryStringParameters, callback );

    }

};

exports.twodaysready_family_member_update = function ( data, context, callback ) {

    handleRequest( family_member.saveFamilyMember,
        data, helpers.parse( data.body ), callback );

};

/* end family members*/

/* start contact */

exports.twodaysready_contact_delete = function ( data, context, callback ) {

    handleRequest( contact.deleteContact,
        data, data.queryStringParameters.id, callback );

};

exports.twodaysready_contact_get = function ( data, context, callback ) {

    if ( data.queryStringParameters && data.queryStringParameters.id &&
        data.queryStringParameters.id !== "" ) {

        handleRequest( contact.getContact, data, data.queryStringParameters.id, callback );

    } else {

        handleRequest( contact.getContacts, data, data.queryStringParameters, callback );

    }

};

exports.twodaysready_contact_update = function ( data, context, callback ) {

    handleRequest( contact.saveContact,
        data, helpers.parse( data.body ), callback );

};

/* end contact*/

/* start feed */

exports.twodaysready_feed_delete = function ( data, context, callback ) {

    handleRequest( feed.deleteFeed,
        data, data.queryStringParameters.id, callback );

};

exports.twodaysready_feed_get = function ( data, context, callback ) {

    if ( data.queryStringParameters && data.queryStringParameters.id &&
        data.queryStringParameters.id !== "" ) {

        handleRequest( feed.getFeed, data, data.queryStringParameters.id, callback );

    } else {

        handleRequest( feed.getFeedItems, data, data.queryStringParameters, callback );

    }

};

exports.twodaysready_feed_update = function ( data, context, callback ) {

    handleRequest( feed.saveFeed,
        data, helpers.parse( data.body ), callback );

};

/* end feed*/