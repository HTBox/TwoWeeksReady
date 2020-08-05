const glob = require( "glob" ),
    render = require( "./render-pages" );


glob( "./public/pages/**/*.json", function ( er, files ) {

    for ( let index = 0; index < files.length; index++ ) {

        render.renderPage( files[ index ] );

    }

} );