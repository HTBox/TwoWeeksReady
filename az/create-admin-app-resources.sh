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

echo "Create Web apps"
APPSERVICEPLAN_NAME=${ENV_PREFIX}admin_asp
WEBAPP_NAME=${ENV_PREFIX}admin
az appservice plan create --sku B1 --name $APPSERVICEPLAN_NAME
az webapp create --plan $APPSERVICEPLAN_NAME --name $WEBAPP_NAME --runtime "DOTNET|5.0"

