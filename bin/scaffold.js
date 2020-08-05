const glob = require( "glob" ),
    helpers = require( "./libs/helpers" );


glob( "data/pages/**/*.json", {}, function ( er, files ) {

    for ( let index = 0; index < files.length; index++ ) {

        let config = helpers.readJSON( files[ index ] );

        if ( config && config.slug ) {

            helpers.createFile( "../public/src/pages/" + config.slug + "/index.html",
                "<h1>" + config.title + "</h1>", true );

        }

    }

} );