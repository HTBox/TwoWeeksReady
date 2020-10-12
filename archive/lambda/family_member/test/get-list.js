const helpers = require( "../../libs/helpers" ),
    lambda = require( "../index" );

lambda.getFamilyMembers()
    .then( results => {

        helpers.writeJSON( "familie-members.json", results, true );

    } )
    .catch( err => {

        helpers.writeJSON( "error.json", err, true );

    } );