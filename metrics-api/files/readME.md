# Remote Device Script

This file is an amalgamation of both the index.js and metrics.js

## Use
This script is going to be used for the remote devices. There are two types downloadable files:

- Host Device files
- Remote Device files

`This file` is the only file that will be ran on a `remote device`, the differentiation between the two types of devices
is as follows.

## Remote Device

This device will only have a simple API that will aquire resource data of the device and have it accessible through an api.

## Hosting Device

The hosting device will be a device that hosts the front end, it will also have the same script as the remote devices and will be the default device
that is shown on the front end. this device, using the front end will fetch data from the api's to show a specific remote devices data when selected on
the front end.