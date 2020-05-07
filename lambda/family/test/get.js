const helpers = require( "../../libs/helpers" ),
    lambda = require( "../index" );


lambda.getFamily( {
        "id": "2e97b01e-2aff-4c7a-b224-b594cee95a11"
    } )
    .then( family => {

        helpers.writeJSON( "family.json", family, true );

    } )
    .catch( err => {

        helpers.writeJSON( "error.json", err, true );

    } );