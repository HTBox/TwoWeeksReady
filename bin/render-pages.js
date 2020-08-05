const helpers = require("./libs/helpers"),
  path = require("path"),
  fs = require("fs"),
  site_config = helpers.readJSON("./public/site.json");

function loadSrcData(key) {
  return helpers.readJSON("../public/api/" + key + ".json");
}

function ensureFile(key) {
  try {
    let stats = fs.statSync(key);

    if (!stats) {
      helpers.createFile(key, "", false);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      helpers.createFile(key, "", false);
    }
  }

  // ,
  // function ( err, stat ) {
  //   if ( err == null ) {
  //     console.log( 'File exists' );
  //   } else if ( err.code === 'ENOENT' ) {
  //     // file does not exist
  //     fs.writeFile( 'log.txt', 'Some log\n' );
  //   } else {
  //     console.log( 'Some other error: ', err.code );
  //   }
  // } );
}

function appendData(page) {
  if (page.data) {
    for (let index = 0; index < page.data.length; index++) {
      const key = page.data[index];

      page[key] = loadSrcData(key);
    }
  }

  return page;
}

function mergeAssets(base, page) {
  page.forEach(asset => {
    if (!base.includes(asset)) {
      base.push(asset);
    }
  });

  return base;
}

exports.renderPage = function(slug) {
  let page = helpers.readJSON(slug) || {};

  ensureFile("../public/src/pages/" + page.key + "/index.html");

  let html = helpers.readFile(
    "../public/src/pages/" + page.key + "/index.html"
  );

  html = html || "";
  slug = "/" + page.slug;

  page.scripts.core = mergeAssets(
    site_config.scripts.core || [],
    page.scripts.core || []
  );
  page.scripts.controllers = mergeAssets(
    site_config.scripts.controllers || [],
    page.scripts.controllers || []
  );
  page.scripts.page_services = mergeAssets(
    site_config.scripts.page_services || [],
    page.scripts.page_services || []
  );
  page.scripts.core_app = mergeAssets(
    site_config.scripts.core_app || [],
    page.scripts.core_app || []
  );
  //page.scripts = Object.assign( {}, site_config.scripts, page.scripts );

  page.scripts.controllers.forEach(key => {
    ensureFile("../public/" + key);
  });

  page = Object.assign({}, site_config, page);

  page = appendData(page);

  let shell = helpers.readFile("../public/src/shells/index.html");

  html = shell.replace(/<%body%>/gi, html).replace(/<%slug%>/gi, slug);

  console.log("../public/" + page.key + "/index.html");

  if (page.make_details) {
    let data = page[page.data[0]];

    for (let index = 0; index < data.length; index++) {
      let itemData = data[index];

      let detailConfig = Object.assign({}, page);

      detailConfig.scripts = page.scripts;

      let slugKey = helpers.makeSlug(itemData[page.titleKey]);

      detailConfig.details = itemData;
      detailConfig.slug = detailConfig.slug.replace("{{slugKey}}", slugKey);
      detailConfig.url = detailConfig.url.replace("{{slugKey}}", slugKey);
      detailConfig.title = itemData[page.titleKey];

      let pageHTML = helpers.render(html, detailConfig);

      helpers.createFile(
        "../public/" + detailConfig.slug + "/index.html",
        pageHTML,
        true
      );
    }
  } else {
    html = helpers.render(html, page);

    helpers.createFile("../public/" + page.slug + "/index.html", html, true);
  }
};
