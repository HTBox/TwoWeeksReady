const helpers = require( "../../libs/helpers" ),
    lambda = require( "../index" );


lambda.getContact( {
        "id": "TBA"
    } )
    .then( result => {

        helpers.writeJSON( "contact.json", result, true );

    } )
    .catch( err => {

        helpers.writeJSON( "error.json", err, true );

    } );