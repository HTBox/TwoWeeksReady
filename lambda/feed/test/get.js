const helpers = require( "../../libs/helpers" ),
    lambda = require( "../index" );


lambda.getFeed( {
        "id": "0c75d34b-ce7b-4592-8fc0-f8f5430c0b76"
    } )
    .then( item => {

        helpers.writeJSON( "item.json", item, true );

    } )
    .catch( err => {

        helpers.writeJSON( "error.json", err, true );

    } );