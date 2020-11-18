# TwoWeeksReady API

[![Build Status](https://github.com/HTBox/TwoWeeksReady/workflows/Api%20CI%2FCD/badge.svg)](https://github.com/HTBox/TwoWeeksReady/actions?query=workflow%3A"Api+CI%2FCD")

## Prerequisites

[.NET Core SDK 3.1](https://dotnet.microsoft.com/download)

[Azure Functions Core Tools 3](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Ccsharp%2Cbash#install-the-azure-functions-core-tools)

  `npm i -g azure-functions-core-tools@3 --unsafe-perm true`

### Compile

``` console
dotnet build
```

### Run from the command line

``` console
func start --build
```

### Debug from VS Code menu

F5

### Example local.settings.json

```Javascript
{
  "IsEncrypted": false,
  "Values": {
    "CosmosDBConnection": "<<COSMOSDB CONNECTION STRING>>",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet"
  },
  "Host":{
    "CORS": "*"
  }
}
```
