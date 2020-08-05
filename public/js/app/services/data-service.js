( function () {

    "use strict";

    let defaults = {
        ENTITY: "entity",
        Key: "key-entity",
        apiBase: "https://ks09vmmyw1.execute-api.us-east-1.amazonaws.com/development/",
        recordLifeSpan: 60 * 15
    };

    class DataService {

        constructor( options ) {

            this.settings = Object.assign( {}, defaults, options );

        }

        getRecord( options ) {

            options = options || {};

            return love2dev.http.cacheAndFetch( {
                    "authorized": options.authorized || false,
                    "key": this.settings.Key + "-" + options.id,
                    "ttl": this.settings.recordLifeSpan,
                    "url": this.settings.apiBase + this.settings.ENTITY + "?id=" + options.id
                } );
        }

        getRecords( options ) {

            options = options || {};

            return love2dev.http.cacheAndFetch( {
                "authorized": options.authorized || false,
                "key": this.settings.Key,
                "ttl": this.settings.recordLifeSpan,
                "url": this.settings.apiBase + this.settings.ENTITY
            } );

        }

        saveRecord( value, options ) {

            options = options || {};

            return love2dev.http.postAndClearCache( {
                authorized: options.authorized || false,
                url: this.settings.apiBase + this.settings.ENTITY,
                key: this.settings.Key,
                body: JSON.stringify( value )
            } );

        }

        deleteRecord( options ) {

            options = options || {};

            return love2dev.http.delete( {
                    "authorized": options.authorized || false,
                    "url": this.settings.apiBase + this.settings.ENTITY + "?id=" + options.id
                } )
                .then( function ( response ) {

                    if ( response.ok ) {

                        return response.json()
                            .then( record => {
                                return record.Item || record;
                            } );

                    }

                } );
        }

    }

    window.DataService = DataService;

} )();