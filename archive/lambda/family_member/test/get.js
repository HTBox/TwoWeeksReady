const helpers = require( "../../libs/helpers" ),
    lambda = require( "../index" );


lambda.getFamilyMember( {
        "id": "f46ffbe6-d9a1-4aec-b066-be2d44a1dd05"
    } )
    .then( family => {

        helpers.writeJSON( "family-member.json", family, true );

    } )
    .catch( err => {

        helpers.writeJSON( "error.json", err, true );

    } );