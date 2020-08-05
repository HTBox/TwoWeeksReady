const AWS = require( "aws-sdk" ),
    zlib = require( "zlib" ),
    utils = require( "./helpers" ),
    utf8 = "utf-8",
    region = "us-east-1";

exports.sendSMS = function ( payload ) {

    return new Promise( function ( resolve, reject ) {

        let sns = new AWS.SNS( {
            "region": process.env.REGION || region
        } );

        sns.publish( payload, ( err, data ) => {

            if ( err ) {
                reject( err );
            } else {
                resolve( data );
            }

        } );

    } );

};

exports.publishMessage = options => {

    return new Promise( function ( resolve, reject ) {

        let sns = new AWS.SNS( {
            "region": options.region || process.env.REGION || region
        } );

        let msg = options.Message;

        if ( typeof msg === "object" ) {

            msg = JSON.stringify( msg );

        }

        console.log( {
            TopicArn: options.TopicArn,
            Message: msg
        } );

        sns.publish( {
            TopicArn: options.TopicArn,
            Message: msg
        }, ( err, data ) => {

            if ( err ) {
                reject( err );
            } else {
                resolve( data );
            }

        } );

    } );

};

exports.parseSNSMessage = data => {

    data = utils.parse( data );

    return utils.parse( data.Records[ 0 ].Sns.Message );

};

exports.parseModuleMessage = function ( msg ) {

    msg = this.parseSNSMessage( msg );

    return {
        nextAction: msg.nextAction,
        page: msg.page,
        domain: msg.domain
    };

};

exports.uploadFile = options => {

    return new Promise( ( resolve, reject ) => {

        let params = {
            Bucket: options.Bucket,
            ContentType: utils.getMimeType( options.key ),
            CacheControl: "private, max-age=864000, s-max-age=10800",
            ACL: "public-read",
            Key: options.key
        };

        if ( options.WebsiteRedirectLocation ) {
            params.WebsiteRedirectLocation = options.WebsiteRedirectLocation;
        }

        if ( options.gzip ) {

            let buf = Buffer.from( options.body, utf8 );

            params.Body = zlib.gzipSync( buf, {
                level: 9
            } );

            params.ContentEncoding = "gzip";

        } else {

            params.Body = options.body;

        }

        let s3 = new AWS.S3( {


        } );

        s3.upload( params, function ( err, data ) {

            if ( err ) {

                console.error( "Error! ", err );
                console.error( "params ", params.Bucket );

                reject( err );

            } else {

                console.log( "Successfully uploaded " + data.key + ". " );

                data.page = options.body;

                resolve( data );

            }

        } );

    } );

};

exports.objectExists = options => {

    return new Promise( ( resolve, reject ) => {

        let s3 = new AWS.S3( {


        } );

        s3.headObject( {
            Bucket: options.Bucket,
            Key: options.key
        }, function ( err, data ) {

            if ( err ) {

                if ( err.code === "NotFound" ) {

                    resolve();

                } else {

                    reject( err, err.stack ); // an error occurred

                }

            } else {

                resolve( data ); // successful response

            }

        } );

    } );

};

exports.moveFile = options => {

    return new Promise( ( resolve, reject ) => {

        let s3 = new AWS.S3( {


        } );

        console.log( "copy options: ", options );

        s3.copyObject( {
            Bucket: options.Bucket,
            CopySource: "/" + options.srcBucket + "/" + options.srcKey,
            Key: options.destKey
        }, function ( err, data ) {

            if ( err ) {

                reject( err, err.stack ); // an error occurred

            } else {

                let params = {
                    Bucket: options.Bucket,
                    Key: options.srcKey
                };

                s3.deleteObject( params, function ( err, data ) {

                    if ( err ) {

                        console.error( "Error! ", err );
                        console.error( "params ", params.Bucket );

                        reject( err );

                    } else {

                        console.log( "Successfully deleted " + data.key + ". " );

                        resolve( data.key );

                    }

                } );
            }

        } );

    } );

};

exports.deleteFile = options => {

    return new Promise( ( resolve, reject ) => {

        let params = {
            Bucket: options.Bucket,
            Key: options.key
        };

        let s3 = new AWS.S3( {


        } );

        s3.deleteObject( params, function ( err, data ) {

            if ( err ) {

                console.error( "Error! ", err );
                console.error( "params ", params.Bucket );

                reject( err );

            } else {

                console.log( "Successfully deleted " + data.key + ". " );

                resolve( data.key );

            }

        } );

    } );

};

exports.sendEMail = msg => {

    return new Promise( function ( resolve, reject ) {

        let ses = new AWS.SES( {
            "region": region
        } );

        let params = {
            Destination: {
                ToAddresses: [ msg.toAddr ]
            },
            Message: {
                Body: {
                    Html: {
                        Data: msg.htmlBody,
                        Charset: utf8
                    },
                    Text: {
                        Data: msg.txtBody,
                        Charset: utf8
                    }
                },
                Subject: {
                    Data: msg.subject
                }
            },
            Source: msg.fromAddr,
            ReplyToAddresses: [ msg.fromAddr ]
        };

        ses.sendEmail( params, function ( err, data ) {

            if ( err ) {

                console.log( err, err.stack ); // an error occurred

                reject( err );

            } else {

                console.log( data ); // successful response
                console.log( "sent e-mail" );

                resolve( data );

            }

        } );

    } );

};

exports.getFile = options => {

    return new Promise( ( resolve, reject ) => {

        let s3 = new AWS.S3( {


        } );

        let params = {
            Bucket: options.Bucket,
            Key: options.key
        };

        s3.getObject( params, function ( err, data ) {

            if ( err ) {

                if ( err === "NoSuchKey" ) {
                    resolve( undefined );
                }

                reject( err );

            } else {

                let body;

                if ( data.ContentEncoding === "gzip" ) {

                    body = zlib.unzipSync( data.Body ).toString( utf8 );

                } else {

                    body = data.Body.toString( utf8 );

                }

                resolve( body );
            }

        } );

    } );

};

exports.getObjectBody = data => {

    let body;

    if ( data.ContentEncoding === "gzip" ) {

        body = zlib.unzipSync( data.Body ).toString( utf8 );

    } else {

        body = data.Body.toString( utf8 );

    }

    return body;

};

exports.getKeyList = options => {

    return new Promise( ( resolve, reject ) => {

        let params = {
            Bucket: options.Bucket,
            Prefix: options.Prefix
        };

        let s3 = new AWS.S3( {


        } );


        s3.listObjectsV2( params, function ( err, data ) {
            if ( err ) {

                reject( err );

            } else {

                resolve( data );
            }

        } );

    } );

};