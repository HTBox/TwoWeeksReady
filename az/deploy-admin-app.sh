#!/bin/bash
set -e

RESOURCE_GROUP='2wr-resources'
ENV_PREFIX='2wrdev'

while getopts :r:e:z: opt; do
    case ${opt} in
        r) RESOURCE_GROUP=${OPTARG};;
        e) ENV_PREFIX=${OPTARG};;
        z) ZIP_PACKAGE=${OPTARG};;
    esac
done

az configure -d group=$RESOURCE_GROUP

echo "Deploying admin app"
WEBAPP_NAME=${ENV_PREFIX}admin
az webapp deployment source config-zip -n $WEBAPP_NAME --src $ZIP_PACKAGE