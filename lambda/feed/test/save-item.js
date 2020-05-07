const helpers = require( "../../libs/helpers" ),
    lambda = require( "../index" );

let item = helpers.readJSON( "item.json" );

lambda.saveFeed( item )
    .then( response => {

        console.log( response );
    } )
    .catch( err => {

        helpers.writeJSON( "error.json", err, true );

    } );