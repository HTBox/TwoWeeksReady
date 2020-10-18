#!/bin/bash
set -e

RESOURCE_GROUP='2wr-resources'
ENV_PREFIX='2wrdev'

while getopts :r:e: opt; do
    case ${opt} in
        r) RESOURCE_GROUP=${OPTARG};;
        e) ENV_PREFIX=${OPTARG};;
    esac
done

az configure -d group=$RESOURCE_GROUP

STORAGE_ACCOUNT=${ENV_PREFIX}webstorage
echo "Deploying to $STORAGE_ACCOUNT"
az storage blob upload-batch --account-name $STORAGE_ACCOUNT -s ../2wr-app/dist -d '$web'
az cdn endpoint purge -n $ENV_PREFIX --profile-name $ENV_PREFIX --no-wait --content-paths '/' '/index.html' '/manifest.json' '/sw.js'