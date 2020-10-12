const helpers = require( "../../libs/helpers" ),
    lambda = require( "../index" );

lambda.getFeedItems()
    .then( results => {

        helpers.writeJSON( "feed-items.json", results, true );

    } )
    .catch( err => {

        helpers.writeJSON( "error.json", err, true );

    } );