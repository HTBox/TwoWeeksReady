const glob = require( "glob" ),
    render = require( "./render-pages" );


glob( "../public/src/pages/**/*.html", function ( er, files ) {

    for ( let index = 0; index < files.length; index++ ) {

        render.renderPage( files[ index ] );

    }

} );