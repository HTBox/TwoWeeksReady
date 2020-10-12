const helpers = require( "../../libs/helpers" ),
    lambda = require( "../index" );

lambda.getFamilies()
    .then( family => {

        helpers.writeJSON( "families.json", family, true );

    } )
    .catch( err => {

        helpers.writeJSON( "error.json", err, true );

    } );