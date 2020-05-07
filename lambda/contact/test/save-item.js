const helpers = require( "../../libs/helpers" ),
    lambda = require( "../index" );

let family = helpers.readJSON( "contact.json" );

lambda.saveContact( family )
    .then( response => {

        console.log( response );
    } )
    .catch( err => {

        helpers.writeJSON( "error.json", err, true );

    } );