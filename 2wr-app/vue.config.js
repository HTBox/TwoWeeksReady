const Dotenv = require('dotenv-webpack');

module.exports = {
   pwa: {
     workboxPluginMode: "InjectManifest",
     workboxOptions: {
       swSrc: "public/service-worker.js"
     },
     manifestOptions: {
       start_url: "/index.html"
     }
   },
   configureWebpack: {
    plugins: [
      new Dotenv()
    ]
  },
  "transpileDependencies": [
    "vuetify"
  ]
}