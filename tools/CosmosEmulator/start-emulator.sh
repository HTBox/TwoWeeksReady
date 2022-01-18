#!/usr/bin/env bash

# Setup CosmosDB Docker Emulator
ipaddr="`ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}' | head -n 1`"
docker pull mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator

# start emulator
docker run --detach --rm -p 8081:8081 -p 10251:10251 -p 10252:10252 -p 10253:10253 -p 10254:10254  -m 3g --cpus=2.0 --name=test-linux-emulator -e AZURE_COSMOS_EMULATOR_PARTITION_COUNT=10 -e AZURE_COSMOS_EMULATOR_ENABLE_DATA_PERSISTENCE=true -e AZURE_COSMOS_EMULATOR_IP_ADDRESS_OVERRIDE=$ipaddr -it mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator &

# wait for process to complete and server to start
wait
sleep 45s # necessary wait time for the cosmosdb server to start up and start responding to web requests

# install the certificate
curl --insecure --url https://localhost:8081/_explorer/emulator.pem -o ~/emulatorcert.crt
sudo cp ~/emulatorcert.crt /usr/local/share/ca-certificates/emulatorcert.crt
sudo update-ca-certificates

# setup database tables
pushd ./tools/CosmosEmulator
dotnet run /setup
popd
