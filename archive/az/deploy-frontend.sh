#!/bin/bash
set -e

ENV_PREFIX='twrdev'

while getopts :e: opt; do
    case ${opt} in
        e) ENV_PREFIX=${OPTARG};;
    esac
done

az configure -d group=$ENV_PREFIX

STORAGE_ACCOUNT=${ENV_PREFIX}storage
echo "Deploying to $STORAGE_ACCOUNT"
az storage blob upload-batch --account-name $STORAGE_ACCOUNT -s ../public -d '$web'
az cdn endpoint purge -n $ENV_PREFIX --profile-name $ENV_PREFIX --no-wait --content-paths '/' '/index.html' '/manifest.json' '/sw.js'