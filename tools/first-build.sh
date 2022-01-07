#!/usr/bin/env bash

# restore and build dotnet projects (api & admin)
dotnet restore ./TwoWeeksReady.Common
dotnet restore ./api/api.sln
dotnet restore ./admin/admin.sln
dotnet build ./TwoWeeksReady.Common
dotnet build ./api/api.sln
dotnet build ./admin/admin.sln

# restore Vue app (2wr-app)
pushd ./2wr-app
npm install
npm install -g azurite
npx playwright instal
npm run build
popd

# setup default configuration files
bash ./tools/setup-config.sh > /dev/null