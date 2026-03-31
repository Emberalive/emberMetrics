const fs = require('fs').promises;
const path = require('path');
const storedFilePath = path.join(__dirname, `../persistentData/devices.json`);
const tmpfilePath = storedFilePath + ".tmp"

async function findDevice (id) {
    if (id) {
        const devices = await readDevices();
        if (devices.length === 0) return {success: false};
        const index = devices.findIndex(device => device.id === id);
        if (index === -1) {
            console.log('[ Server - devices /findDevice ] Device not found')
            return {success: false};
        }
        return {success: true}
    }
    console.log('[ Server - devices /findDevice ] No id sent')
    return {success: false}
}

async function readDevices () {
    const rawDevices = await fs.readFile(storedFilePath, 'utf8')
    return JSON.parse(rawDevices)
}

async function writeDevices (newDevices) {
    try {
        await fs.writeFile(tmpfilePath, JSON.stringify(newDevices, null, 2), 'utf8')

        await fs.rename(tmpfilePath, storedFilePath)
        return {success: true}
    } catch (e) {
        console.error("Error writing to devices: ", e);
        return {
            success: false,
        }
    }
}

async function getDevices () {
    try {
        const devices = await readDevices()
        console.log("[Server - GET | devices] devices to send: " + JSON.stringify(devices))
        return {
            devices: devices,
            success: true
        }
    } catch (e) {
        console.error('Error reading devices:', e)
    }
}

async function addDevice (device) {
    try {
        console.log(`[Server - POST | devices] addDevice: ${JSON.stringify(device)} ]`)
        let deviceData = await readDevices()
        for (const d of deviceData) {
            if (d.ip === device.ip) {
                console.log(`[ Server - POST | devices] Device: ${device.name}\'s ip address is already in use`)
                return {success: false, reason: 'device already exists'}
            }
        }
        deviceData.push(device)
        console.log(`[Server - POST | devices] updatedDevices: ${JSON.stringify(deviceData)}`)
        return await writeDevices(deviceData)
    } catch (e) {
        console.error('Error adding device:', e)
    }
}

async function deleteDevice (deviceID) {
    console.log(`[Server - DELETE | devices] deleteDevice: ${deviceID}`)
    const devices = await readDevices()
    const index = devices.findIndex((device) => device.id === deviceID)

    if (index === -1) {
        console.log(`[Server - DELETE | devices] could not find the device to delete`)
        return {
            success: false,
        }
    }
    devices.splice(index, 1)
    return await writeDevices(devices)
}

async function editDevice (device) {
    const devices = await readDevices()
    console.log("[Server - PATCH | devices] editDevice: " + JSON.stringify(device, null, 2))
    const editedDevices = devices.map( oldDevice => {
        if (oldDevice.id === device.id) {
            return {
                ...oldDevice, name: device.name, ip: device.ip
            }
        }
        return oldDevice
    })
    console.log("[Server - PATCH | devices] writing new devices")
    return await writeDevices(editedDevices)
}

module.exports = {getDevices, addDevice, deleteDevice, editDevice, findDevice}