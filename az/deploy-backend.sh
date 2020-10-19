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

echo "Deploying function app"
az functionapp deployment source config-zip  -n $ENV_PREFIX --src $ZIP_PACKAGE