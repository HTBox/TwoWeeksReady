#!/bin/bash
set -e

RESOURCE_GROUP='2wr-resources'
ENV_PREFIX='2wrdev'
LOCATION='centralus'

while getopts :r:e: opt; do
    case ${opt} in
        r) RESOURCE_GROUP=${OPTARG};;
        e) ENV_PREFIX=${OPTARG};;
        l) LOCATION=${OPTARG};;
    esac
done

az configure -d group=$RESOURCE_GROUP
az configure -d location=$LOCATION
az group create -n $RESOURCE_GROUP


STORAGE_ACCOUNT=${ENV_PREFIX}fnstorage
echo "Creating Storage Account ${STORAGE_ACCOUNT}"
az storage account create -n $STORAGE_ACCOUNT

echo "Create app insights"
az extension add -n application-insights
APP_INSIGHTS=${ENV_PREFIX}ai
az monitor app-insights component create --app $APP_INSIGHTS 

echo "Create function apps"
az functionapp create --consumption-plan-location $LOCATION --name $ENV_PREFIX --os-type Windows --runtime dotnet --storage-account $STORAGE_ACCOUNT --app-insights $APP_INSIGHTS --functions-version 3
CDN_PROFILE_NAME=${ENV_PREFIX}
ALLOWED_ORIGINS="https://${CDN_PROFILE_NAME}.azureedge.net http://localhost:8080"
az functionapp cors remove -n $ENV_PREFIX --allowed-origins $ALLOWED_ORIGINS
az functionapp cors add -n $ENV_PREFIX --allowed-origins $ALLOWED_ORIGINS

echo "Create Cosmos DB"
az cosmosdb create -n $ENV_PREFIX --enable-free-tier true
az cosmosdb sql database create -a $ENV_PREFIX -n 2wr --throughput 400
az cosmosdb sql container create -a $ENV_PREFIX -d 2wr -n familymembers --partition-key-path "/id"

echo "Configure function apps"
CONNECTION_STRING=$(az cosmosdb keys list --type connection-strings -n $ENV_PREFIX --query connectionStrings[0].connectionString --out tsv )
az webapp config connection-string set -n $ENV_PREFIX --setting CosmosDBConnection="$CONNECTION_STRING" -t "Custom"