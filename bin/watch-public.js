const watch = require( "watch" ),
    render = require( "./render-pages" );

watch.watchTree( "../public/src/pages/", function ( f, curr, prev ) {

    if ( typeof f == "object" && prev === null && curr === null ) {
        // Finished walking the tree
        console.log( "Finished walking the tree" );

    } else if ( prev === null ) {
        // f is a new file
        //console.log( "prev" );
        render.renderPage( f );
    } else if ( curr.nlink === 0 ) {
        // f was removed
        //console.log( "removed" );
        render.renderPage( f );
    } else {
        // f was changed
        console.log( "changed: ", f );
        render.renderPage( f );
    }
} );