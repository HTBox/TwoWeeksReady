const db = require( "../libs/docClient" ),
    aws = require( "../libs/aws-utils" ),
    table_name = require( "../libs/aws-utils" ).table_name,
    assetType = "family";


function saveFamily( data ) {

    data.assetType = assetType;

    return db.saveEntity( data, table_name );

}

function getFamilies( options ) {

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

function getFamily( id ) {

    if ( !id || id === "" ) {
        return Promise.reject( {
            statusCode: 422,
            campaign: "missing family id"
        } );

    }

    return db.getEntity( {
        assetType: assetType,
        assetId: id
    }, table_name );

}

exports.deleteFamily = function ( data ) {

    getFamily( data.id )
        .then( record => {

            record.active = false;

            return saveFamily( record );

        } );

};

exports.saveFamily = saveFamily;

exports.getFamily = getFamily;

exports.getFamilies = getFamilies;