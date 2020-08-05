const helpers = require("./libs/helpers"),
  path = require("path");

exports.renderPage = function(slug) {
  slug = slug.replace(/\\/g, "/");

  let pathObj = path.parse(slug);

  let key = pathObj.dir.replace("../public/src/pages", "");

  if (key === "") {
    key = "home";
  }

  console.log(key);

  let shell = helpers.readFile("../public/src/shells/index.html");

  let html = helpers.readFile(slug);

  html = shell.replace(/<%body%>/gi, html).replace(/<%slug%>/gi, key);

  helpers.createFile(slug.replace("src/pages/", ""), html, true);
};
