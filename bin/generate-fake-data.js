const helpers = require( "./libs/helpers" ),
    db = require( "./libs/docClient" ),
    faker = require( "faker" ),
    table_name = "twoDaysReady";

let records = [];

function basePersonInfo() {

    return {
        "first_name": faker.name.firstName(),
        "last_name": faker.name.lastName(),
        "email": faker.internet.email(),
    };

}

function makeFamilyMember( familyId ) {

    return Object.assign( {}, {
        "assetType": "family-member",
        "assetId": faker.random.uuid(),
        "avatar": faker.image.avatar(),
        "active": true,
        "familyId": familyId
    }, basePersonInfo() );

}

function getFamilyMembers( familyId ) {

    let i = faker.random.number( {
        min: 3,
        max: 7
    } );

    let members = [];

    for ( let index = 0; index < i; index++ ) {

        const member = makeFamilyMember( familyId );

        records.push( member );

        members.push( {
            "assetId": member.assetId,
            "first_name": faker.name.firstName(),
            "last_name": faker.name.lastName(),
            "email": faker.internet.email(),
            "avatar": faker.image.avatar(),
        } );

    }

    return members;

}

function makeFamily() {

    let family = {
        "assetType": "family",
        "assetId": faker.random.uuid(),
        "family_name": faker.company.companyName(),
        "active": true
    };

    family.members = getFamilyMembers( family.assetId );

    records.push( family );

}

function makeFamilies() {

    return new Promise( ( resolve, reject ) => {

        let i = faker.random.number( {
            min: 4,
            max: 7
        } );

        for ( let index = 0; index < i; index++ ) {

            makeFamily();

        }

        resolve();

    } );

}

function feedItem() {

    return {
        "assetType": "feedItem",
        "assetId": faker.random.uuid(),
        "municipality": faker.address.county(),
        "state_provice": faker.address.stateAbbr(),
        "headline": faker.lorem.sentence(),
        "body": faker.lorem.paragraphs( faker.random.number( {
            min: 5,
            max: 15
        } ) ),
        "active": true
    };
}

function makeFeed() {

    return new Promise( ( resolve, reject ) => {

        for ( let index = 0; index < 10; index++ ) {

            records.push( feedItem() );

        }

        resolve();

    } );

}

function hazardHuntItem() {

    /*
    title
    description
    photos []
    video
    */

}

function makeHazardHunt() {}

function emergencyContact() {

    /*
        first
        last
        email
        phone
        address ???
        who should contact

    */

}

function makeEmergencyContacts() {}


function phoneTreeNode() {

    /*
        first
        last
        email
        phone
        address ???
        who should contact

    */

}

function phoneTreeNodes() {}

function disasterTypeInfo() {}

function makeDisasterTypes() {}



function storeRecords() {

    let actions = [];

    for ( let index = 0; index < records.length; index++ ) {

        actions.push(
            db.saveEntity( records[ index ], table_name )
        );

    }

    return Promise.all( actions );

}

makeFamilies()
    .then( makeFeed )
    .then( storeRecords )
    .then( () => {
        console.log( "done" );
    } )
    .catch( err => {

        helpers.writeJSON( "error.json", err, true );
    } );