const db = require( "../libs/docClient" ),
    aws = require( "../libs/aws-utils" ),
    table_name = "twoDaysReady",
    assetType = "feedItem";

function saveFeed( data ) {

    data.assetType = assetType;

    return db.saveEntity( data, table_name );

}

function getFeedItems( options ) {

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

function getFeed( id ) {

    if ( !id || id === "" ) {
        return Promise.reject( {
            statusCode: 422,
            campaign: "missing feed id"
        } );

    }

    return db.getEntity( {
        assetType: assetType,
        assetId: id
    }, table_name );

}

exports.deleteFeed = function ( data ) {

    getFeed( data.id )
        .then( record => {

            record.active = false;

            return saveFeed( record );

        } );

};

exports.saveFeed = saveFeed;

exports.getFeed = getFeed;

exports.getFeedItems = getFeedItems;