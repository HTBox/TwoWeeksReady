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

echo "Creating Resource Group $RESOURCE_GROUP in $LOCATION"

az configure -d group=$RESOURCE_GROUP
az configure -d location=$LOCATION
az group create -n $RESOURCE_GROUP

STORAGE_ACCOUNT=${ENV_PREFIX}webstorage
echo "Creating static site Storage Account ${STORAGE_ACCOUNT}"
az storage account create -n $STORAGE_ACCOUNT
az storage blob service-properties update --account-name $STORAGE_ACCOUNT --static-website --404-document 404.html --index-document index.html
STORAGE_WEB_ENDPOINT=$(az storage account show -n $STORAGE_ACCOUNT --query primaryEndpoints.web -o tsv | awk -F "/" '{ print $3 }')

echo "Storage endpoint for static site hosting: $STORAGE_WEB_ENDPOINT"

CDN_PROFILE_NAME=${ENV_PREFIX}
echo "Creating CDN Profile $CDN_PROFILE_NAME"
az cdn profile create -n $CDN_PROFILE_NAME --sku Standard_Microsoft
az cdn endpoint create -n $CDN_PROFILE_NAME --profile-name $CDN_PROFILE_NAME --origin $STORAGE_WEB_ENDPOINT --origin-host-header $STORAGE_WEB_ENDPOINT --enable-compression
az cdn endpoint rule add -n $CDN_PROFILE_NAME --profile-name $CDN_PROFILE_NAME --rule-name enforcehttps --order 1 --action-name "UrlRedirect"  --redirect-type Found --redirect-protocol HTTPS --match-variable RequestScheme --operator Equal --match-value HTTP
az cdn endpoint rule add -n $CDN_PROFILE_NAME --profile-name $CDN_PROFILE_NAME --rule-name sparewrite --order 2 --action-name "UrlRewrite" --source-pattern '/' --destination /index.html --preserve-unmatched-path false --match-variable UrlFileExtension --operator LessThan --match-value 1

