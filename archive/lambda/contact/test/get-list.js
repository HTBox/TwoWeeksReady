const helpers = require( "../../libs/helpers" ),
    lambda = require( "../index" );

lambda.getContacts()
    .then( results => {

        helpers.writeJSON( "contacts.json", results, true );

    } )
    .catch( err => {

        helpers.writeJSON( "error.json", err, true );

    } );