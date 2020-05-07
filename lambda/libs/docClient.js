const helpers = require( "./helpers" ),
    AWS = require( "aws-sdk" ),
    documentClient = new AWS.DynamoDB.DocumentClient( {
        "region": "us-east-1"
    } );

exports.saveEntity = function ( entity, tableName ) {

    if ( !entity ) {
        return Promise.reject( {
            statusCode: 422,
            message: "missing entity to update"
        } );
    }

    if ( !entity.assetType || entity.assetType === "" ) {
        return Promise.reject( {
            statusCode: 422,
            message: "missing assetType"
        } );
    }

    entity.assetId = entity.assetId || helpers.generateUUID();
    entity.date_updated = new Date().getTime();
    entity.createdAt = entity.created || new Date().getTime();

    return new Promise( function ( resolve, reject ) {

        let params = {
            TableName: tableName,
            Item: entity
        };

        documentClient.put( params, function ( err, data ) {

            if ( err ) {

                reject( err );

            } else {

                resolve( Object.assign( {}, data, {
                    Item: entity
                } ) );

            }

        } );

    } );

};

exports.getEntity = function ( criteria, tableName ) {

    if ( !criteria ) {
        return Promise.reject( {
            statusCode: 422,
            message: "missing criteria to fetch"
        } );
    }

    let params = {
        TableName: tableName,
        Key: {
            "assetType": criteria.assetType,
            "assetId": criteria.assetId
        }
    };

    return new Promise( function ( resolve, reject ) {

        try {

            documentClient.get( params, function ( err, data ) {

                if ( err ) {

                    reject( err );

                } else {

                    resolve( data.Item );

                }

            } );

        } catch ( error ) {

            reject( error );

        }

    } );

};

function searchEntity( options, tableName ) {

    return new Promise( function ( resolve, reject ) {

        let params = {
            KeyConditionExpression: "",
            TableName: tableName,
            limit: 400,
            ConsistentRead: true
        };

        if ( options.values ) {

            params.ExpressionAttributeValues = {};

            for ( let index = 0; index < options.values.length; index++ ) {

                const key = options.values[ index ];

                params.ExpressionAttributeValues[ ":" + key.field ] = key.value;

            }

        }

        for ( let index = 0; index < options.keys.length; index++ ) {

            let key = options.keys[ index ],
                expression = key.field + " " +
                key.condition + " :" + key.field;

            if ( params.KeyConditionExpression === "" ) {

                params.KeyConditionExpression += expression;

            } else {

                params.KeyConditionExpression += " and " + expression;

            }

        }

        if ( options.filters ) {

            for ( let index = 0; index < options.filters.length; index++ ) {

                params.FilterExpression = params.FilterExpression || "";

                let key = options.filters[ index ],
                    expression = "";

                if ( key.condition === "CONTAINS" ) {

                    expression = "contains (" + key.field + ", :" + key.field + ")";

                } else {

                    expression = key.field + " " + key.condition + " :" + key.field;

                }

                if ( params.FilterExpression === "" ) {

                    params.FilterExpression += expression;

                } else {

                    params.FilterExpression += " and " + expression;

                }

            }

        }

        options.Count = options.Count || 0;
        options.Items = options.Items || [];

        //params.Limit = options.limit;

        if ( options.LastEvaluatedKey ) {
            params.ExclusiveStartKey = options.LastEvaluatedKey;
        }

        if ( options.ProjectionExpression ) {
            params.ProjectionExpression = options.ProjectionExpression;
        }

        if ( options.ExpressionAttributeNames ) {
            params.ExpressionAttributeNames = options.ExpressionAttributeNames;
        }

        documentClient.query( params, function ( err, data ) {

            if ( err ) {
                reject( err );
            } else {

                options.Items = [].concat( options.Items || [], data.Items );
                options.Count += data.Count;

                if ( !data.LastEvaluatedKey || options.Items.length >= options.limit ) {

                    resolve( options.Items.slice( 0, options.limit ) );

                } else {

                    options.LastEvaluatedKey = data.LastEvaluatedKey;

                    searchEntity( options, tableName )
                        .then( data => {
                            resolve( data );
                        } );

                }

            }

        } );

    } );

}

exports.searchEntity = function ( options, tableName ) {

    return searchEntity( options, tableName );

};

exports.createQueryParameters = function ( options ) {

    if ( ( !options.assetType || options.assetType === "" ) ) {
        return Promise.reject( {
            statusCode: 422,
            message: "missing assetType"
        } );
    }

    let params = {
        values: [ {
            "field": "assetType",
            "value": options.assetType
        } ],
        "keys": [ {
            "field": "assetType",
            "condition": "="
        } ],
        limit: options.limit || 100
    };

    if ( options.values ) {
        params.values = [].concat( params.values || [], options.values );
    }

    if ( options.filters ) {
        params.filters = options.filters;
    }

    console.log( "params.limit: ", params.limit );

    return Promise.resolve( params );

};