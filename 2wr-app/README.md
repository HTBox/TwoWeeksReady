# 2wr-app

[![Build Status](https://github.com/HTBox/TwoWeeksReady/workflows/2wr-app%20CI%2FCD/badge.svg)](https://github.com/HTBox/TwoWeeksReady/actions?query=workflow%3A%222wr-app+CI%2FCD%22)

## Application wireframes

See [Application wireframes](https://xd.adobe.com/view/5bc4d9d7-cfb8-40aa-4f14-286bffd40f5c-2df5/grid)

## Material design icons

See [Material design icons](https://materialdesignicons.com/)

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
VUE_APP_APIROOT=http://localhost:7071/api
VUE_APP_AUTH0_DOMAIN=********
VUE_APP_AUTH0_CLIENTID=********
VUE_APP_AUTH0_AUDIENCE=********
```
