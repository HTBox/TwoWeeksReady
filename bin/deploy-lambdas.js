const AWS = require( "aws-sdk" ),
    helpers = require( "./libs/helpers" ),
    aws = require( "./libs/aws-utils" );

const lambda = new AWS.Lambda( {
    "region": "us-east-1"
} );

const layers = [
    "arn:aws:lambda:us-east-1:273839204536:layer:base_app:3",
    "arn:aws:lambda:us-east-1:273839204536:layer:website_base:12"
];

const bucket = "data.love2dev",
    zipKey = "two_weeks_ready_lambdas.zip";

function createFunction( options ) {

    return new Promise( function ( resolve, reject ) {

        let params = {
            Code: {
                S3Bucket: bucket,
                S3Key: zipKey
            },
            Description: "",
            FunctionName: options.FunctionName,
            Handler: "index." + options.FunctionName, // is of the form of the name of your source file and then name of your function handler
            MemorySize: 512,
            Publish: true,
            Role: "arn:aws:iam::273839204536:role/Love2Dev-Lambda",
            Runtime: "nodejs12.x",
            Environment: {
                Variables: {
                    "COGNITO_CLIENT_USERPOOLID": "5jpl91qnv4l6qut3m1jau9nvd4",
                    "COGNITO_CLIENT_ID": "us-east-1_4awsXDuiT"
                }
            },
            Timeout: 15
        };

        console.log( "createFunction" );
        console.log( options.FunctionName );

        lambda.createFunction( params, function ( err, data ) {
            if ( err ) {

                console.log( err );

                // updateFunctionCode( options )
                //     .then( response => {

                //         resolve( response );

                //     } )
                //     .catch( err => {
                //         reject( err ); // an error occurred

                //     } );

            } else {

                addLayerToFunction( options.FunctionName )
                    .then( result => {

                        resolve( data ); // successful response

                    } );

            }

        } );

    } );

}

function addLayerToFunction( FunctionName ) {

    return new Promise( function ( resolve, reject ) {

        let params = {
            FunctionName: FunctionName,
            Handler: "index." + FunctionName,
            Layers: layers
        };

        lambda.updateFunctionConfiguration( params, function ( err, data ) {
            if ( err ) reject( err ); // an error occurred
            else resolve( data ); // successful response
        } );

    } );

}

function updateFunctionCode( options ) {

    return new Promise( function ( resolve, reject ) {

        let params = {
            S3Bucket: bucket,
            S3Key: zipKey,
            Publish: true,
            //        Runtime: "nodejs12.x",
            FunctionName: options.FunctionName
        };

        console.log( "updateFunctionCode" );
        console.log( options.FunctionName );

        lambda.updateFunctionCode( params, function ( err, data ) {
            if ( err ) reject( err ); // an error occurred
            else resolve( data ); // successful response
        } );

    } );

}

let functions = require( "../lambda" ),
    p = [];

for ( let key in functions ) {

    if ( functions.hasOwnProperty( key ) &&
        typeof functions[ key ] === "function" ) {

        //updateFunctionCode
        p.push( createFunction( {
            "FunctionName": key
        } ) );

    }

}

Promise.all( p )
    .then( function ( result ) {
        console.log( result );
    } )
    .catch( function ( err ) {

        console.log( err );
    } );