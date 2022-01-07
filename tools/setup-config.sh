#!/usr/bin/env bash

# navigate to script directory
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
pushd $SCRIPT_DIR

# create api settings file from sample
API_SETTINGS_FILE=../api/local.settings.json
if [[ ! -f $API_SETTINGS_FILE ]]
then
cp ./samples/local.settings.sample.json $API_SETTINGS_FILE
fi

# create 2wr-app env from sample
APP_SETTINGS_FILE=../2wr-app/.env
if [[ ! -f $APP_SETTINGS_FILE ]]
then
cp ../2wr-app/.env-sample $APP_SETTINGS_FILE
fi
popd