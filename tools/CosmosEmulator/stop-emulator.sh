#!/usr/bin/env bash

# stop docker process
docker stop test-linux-emulator

# remove SSL certificate
sudo rm /usr/local/share/ca-certificates/emulatorcert.crt
sudo update-ca-certificates