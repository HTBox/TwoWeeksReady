const db = require( "../libs/docClient" ),
    aws = require( "../libs/aws-utils" ),
    table_name = "twoDaysReady",
    assetType = "contact";


function saveContact( data ) {

    let isNew = !data.assetId;

    data.assetType = assetType;

    return db.saveEntity( data, table_name )
        .then( result => {

            data = result;

            if ( isNew ) {
                console.log( "send new contact message" );

                //return sendNewContactMessage( data );

            }

        } )
        .finally( () => {
            return data;
        } );

}

function sendNewContactMessage( contact ) {

    //send SNS message to send confirmation and notification emails

}

function getContacts( options ) {

    options = options || {};

    options.assetType = assetType;

    for ( let key in options ) {

        if ( key !== "assetType" ) {

            if ( options.hasOwnProperty( key ) ) {

                options.values = [ {
                    "field": key,
                    "value": options[ key ]
                } ];

                options.filters = [ {
                    "field": key,
                    "condition": "=",
                    "value": options[ key ]
                } ];

            }

        }

    }

    return db.createQueryParameters( options )
        .then( params => {

            return db.searchEntity( params, table_name );

        } );

}

function getContact( id ) {

    if ( !id || id === "" ) {
        return Promise.reject( {
            statusCode: 422,
            campaign: "missing contact id"
        } );

    }

    return db.getEntity( {
        assetType: assetType,
        assetId: id
    }, table_name );

}

exports.deleteContact = function ( data ) {

    getContact( data.id )
        .then( record => {

            record.active = false;

            return saveContact( record );

        } );

};

exports.saveContact = saveContact;

exports.getContact = getContact;

exports.getContacts = getContacts;

exports.sendNewContactMessage = sendNewContactMessage;