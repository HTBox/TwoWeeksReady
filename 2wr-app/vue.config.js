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
  "transpileDependencies": [
    "vuetify"
  ]
}