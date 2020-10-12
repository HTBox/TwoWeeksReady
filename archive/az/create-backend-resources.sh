#!/bin/bash
set -e

ENV_PREFIX='twrdev'
LOCATION='westus'

while getopts :e:l: opt; do
    case ${opt} in
        e) ENV_PREFIX=${OPTARG};;
        l) LOCATION=${OPTARG};;
        
    esac
done

az configure -d group=$ENV_PREFIX
az configure -d location=$LOCATION
az group create -n $ENV_PREFIX


STORAGE_ACCOUNT=${ENV_PREFIX}fnstg
echo "Creating Storage Account ${STORAGE_ACCOUNT}"
az storage account create -n $STORAGE_ACCOUNT

echo "Create app insights"
az extension add -n application-insights
az monitor app-insights component create --app $ENV_PREFIX 

echo "Create function apps"
az functionapp create --consumption-plan-location $LOCATION --name $ENV_PREFIX --os-type Windows --runtime dotnet --storage-account $STORAGE_ACCOUNT --app-insights $ENV_PREFIX --functions-version 3

echo "Create Cosmos DB"
az cosmosdb create -n $ENV_PREFIX --enable-free-tier true
az cosmosdb sql database create -a $ENV_PREFIX -n twr --throughput 400
az cosmosdb sql container create -a $ENV_PREFIX -d twr -n familymembers --partition-key-path "/id"

echo "Configure function apps"
CONNECTION_STRING=$(az cosmosdb keys list --type connection-strings -n $ENV_PREFIX --query connectionStrings[0].connectionString --out tsv )
az webapp config connection-string set -n $ENV_PREFIX --setting CosmosDBConnection="$CONNECTION_STRING" -t "Custom"