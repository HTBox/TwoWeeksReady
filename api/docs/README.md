This document contains information specific to  the **API Service**.

# Emulators

Development can be done using Azurite and Cosmos DB Emulator. This allows for local development.

## Azurite

## Cosmos DB Emulator

Used to emulate **Azure Cosmos DB**. An alternative to using Azure services online.  

- Cosmos DB Emulator from Powershell

    ``` powershell
    # start
    & $env:ProgramFiles'\Azure Cosmos DB Emulator\CosmosDB.Emulator'

    # shutdown
    & $env:ProgramFiles'\Azure Cosmos DB Emulator\CosmosDB.Emulator'/shutdown
    ```
- To install emulator in Windows
    - https://docs.microsoft.com/azure/cosmos-db/local-emulator
- https://docs.microsoft.com/azure/cosmos-db/emulator-command-line-parameters

# Extensions
## Visual Studio Code Extensions

[Azure Databases for VS Code (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)
