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

echo "Creating Resource Group $ENV_PREFIX in $LOCATION"

az configure -d group=$ENV_PREFIX
az configure -d location=$LOCATION
az group create -n $ENV_PREFIX

echo "Creating static site Storage Account ${ENV_PREFIX}storage"
STORAGE_ACCOUNT=${ENV_PREFIX}storage
az storage account create -n $STORAGE_ACCOUNT
az storage blob service-properties update --account-name $STORAGE_ACCOUNT --static-website --404-document 404.html --index-document index.html
STORAGE_WEB_ENDPOINT=$(az storage account show -n twrdavestorage --query primaryEndpoints.web -o tsv)
STORAGE_WEB_ENDPOINT=${STORAGE_WEB_ENDPOINT/#https\:\/\/}
STORAGE_WEB_ENDPOINT=${STORAGE_WEB_ENDPOINT/\/} #trim the trailing slash
echo "Storage endpoint for static site hosting: $STORAGE_WEB_ENDPOINT"

CDN_PROFILE_NAME=${ENV_PREFIX}
echo "Creating CDN Profile $CDN_PROFILE_NAME"
az cdn profile create -n $CDN_PROFILE_NAME --sku Standard_Microsoft
az cdn endpoint create -n $CDN_PROFILE_NAME --profile-name $CDN_PROFILE_NAME --origin $STORAGE_WEB_ENDPOINT --origin-host-header $STORAGE_WEB_ENDPOINT --enable-compression
az cdn endpoint rule add -n $CDN_PROFILE_NAME --profile-name $CDN_PROFILE_NAME --rule-name enforcehttps --order 1 --action-name "UrlRedirect"  --redirect-type Found --redirect-protocol HTTPS --match-variable RequestScheme --operator Equal --match-value HTTP
az cdn endpoint rule add -n $CDN_PROFILE_NAME --profile-name $CDN_PROFILE_NAME --rule-name sparewrite --order 2 --action-name "UrlRewrite" --source-pattern '/' --destination /index.html --preserve-unmatched-path false --match-variable UrlFileExtension --operator LessThan --match-value 1

