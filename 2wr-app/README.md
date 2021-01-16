# 2wr-app

[![Build Status](https://github.com/HTBox/TwoWeeksReady/workflows/2wr-app%20CI%2FCD/badge.svg)](https://github.com/HTBox/TwoWeeksReady/actions?query=workflow%3A%222wr-app+CI%2FCD%22)

## Application wireframes

See [Application wireframes](https://xd.adobe.com/view/5bc4d9d7-cfb8-40aa-4f14-286bffd40f5c-2df5/grid)

## Material design icons

See [Material design icons](https://materialdesignicons.com/)

## CodeTour Onboarding

In VSCode, you can get a walk-through of the code via the [CodeTour](https://marketplace.visualstudio.com/items?itemName=vsls-contrib.codetour) extension. Install this extension, and review tours available in the 'CodeTour' folder.

![CodeTour API file and panel with the Open tour file selected.](../assets/images/codetour_ui.png "CodeTour panel")

## Project setup

```console
npm install
```

## Compiles and hot-reloads for development

```console
npm run serve
```

## Compiles and minifies for production

```console
npm run build
```

## Run production files after build

First line you only ever need to execute once.
Second line, execute every time prior to the third. (this is for the Powershell terminal, node terminal switch this to `export NODE_ENV=production` or `SET NODE_ENV=production`)

```Powershell
npm install -g serve
$env:NODE_ENV="production"
serve -s dist
```

## Lints and fixes files

```console
npm run lint
```

## Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Sample .env file

```text
NODE_ENV=development
VUE_APP_APIROOT=http://localhost:7071/api/
VUE_APP_AUTH0_DOMAIN=dev-3y6ze-l0.us.auth0.com
VUE_APP_AUTH0_CLIENTID=6TSzRpgtMKR3NI1D4Is1nGO6brBB2wB0
VUE_APP_AUTH0_AUDIENCE=https://2wrdev.azurewebsites.net
```
