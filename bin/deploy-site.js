const glob = require( "glob" ),
  fs = require( "fs" ),
  gitlog = require( "gitlog" ),
  helpers = require( "./libs/helpers" ),
  aws = require( "./libs/aws-utils" );

let baseTime = parseInt( helpers.readFile( "last-dev.txt" ), 10 );
let fileCount = 0,
  current_time = new Date().getTime();
let uploads = [];

const git_options = {
  repo: "../",
  since: new Date( baseTime ),
  fields: [ "subject", "committerDate" ],
  execOptions: {
    maxBuffer: 1000 * 1024
  }
};

//let commits = gitlog(git_options);

let git_results = {
  files: [],
  subjects: [],
  committerDate: []
};

// commits.forEach(commit => {
//   git_results.files = git_results.files.concat(commit.files);
//   git_results.subjects.push(commit.subject);
//   git_results.committerDate.push(commit.committerDate);
// });

function buildGitLog( git ) {
  let str = "Updated Files:\r\n";

  git.files.forEach( file => {
    str += file;
    str += "\r\n";
  } );

  str += "----------------------\r\nComments\r\n";

  git.subjects.forEach( subject => {
    str += subject;
    str += "\r\n";
  } );

  str += "----------------------\r\nComit Dates\r\n";

  git.committerDate.forEach( file => {
    str += file;
    str += "\r\n";
  } );

  return str;
}

function sendSMS( contact ) {
  return aws
    .sendSMS( {
      PhoneNumber: contact,
      Subject: "Public Site Update",
      Message: "love2dev.net has been updated. Give the CDN about 10 minutes to refresh\r\n\r\n"
    } )
    .then( result => {
      console.log( "sent SMS" );
      console.log( result );
    } );
}

function uploadFile( src, key ) {

  console.log( typeof src );

  let options = {
    Bucket: "twoweeksready",
    gzip: true,
    isString: true,
    Body: src.replace( /version = \"\d+\.\d+\"/, "version = " + current_time ),
    key: key.toLowerCase()
  };

  if ( options.Body ) {
    return aws.uploadFile( options ).catch( err => {
      console.error( "error" );
      console.error( err );
    } );
  }

  return Promise.resolve();
}

function uploadFiles( files ) {
  for ( let index = 0; index < files.length; index++ ) {
    const file = files[ index ];

    if ( fs.existsSync( file ) ) {

      let fileTime = parseInt( fs.statSync( file ).mtimeMs, 10 );

      if ( fileTime > baseTime ) {
        let src = helpers.readFile( file );

        fileCount += 1;

        uploadFile( src, file.replace( /..\/public\//, "" ) );

        console.log( file );
      }
    }
  }
}


// options is optional
glob( "../public/**/*.css", {}, function ( er, files ) {
  uploadFiles( files );
} );

glob( "../public/**/*.js", {}, function ( er, files ) {
  uploads.push( uploadFiles( files ) );
} );

glob( "../public/**/*.html", {}, function ( er, files ) {
  uploads.push( uploadFiles( files ) );
} );

glob( "../public/**/*.json", {}, function ( er, files ) {
  uploads.push( uploadFiles( files ) );
} );

// glob( "../public/www/font/*.*", {}, function ( er, files ) {
//     uploads.push( uploadFiles( files ) );
// } );

Promise.all( uploads ).then( results => {
  console.log( results.length );
  console.log( "fileCount: ", fileCount );

  // contacts.forEach( contact => {
  //     sendSMS( contact );
  // } );

  // let body =
  //   "A source code update has been pushed to the 2 Weeks Ready site.\r\nas always you can visit\r\nhttps://d3eohv5wzdvi1t.cloudfront.net" +
  //   "\r\n\r\n" +
  //   buildGitLog( git_results );

  // emails.forEach( email => {
  //     aws.sendEMail( {
  //         fromAddr: "info@love2dev.com",
  //         subject: "2 Weeks Ready Site Update",
  //         toAddr: email,
  //         htmlBody: body.replace( /\r\n/g, "<br>" ),
  //         txtBody: body
  //     } );
  // } );

  helpers.createFile( "last-dev.txt", current_time, true );
} );