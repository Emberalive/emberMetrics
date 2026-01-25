const fs = require('fs').promises;
const filePath = '../persistentData/devices.json'

async function readDevices () {
    const rawDevices = await fs.readFile(filePath, 'utf8')
    return JSON.parse(rawDevices)
}

async function writeDevices (newDevices) {
    try {
        await fs.writeFile(filePath, JSON.stringify(newDevices), 'utf8')
        return {
            success: true,
        }
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
        console.log(`[Server - POST | devices] addDevice: ${device} ]`)
        let deviceData = await readDevices()

        deviceData.push(device)
        console.log(`[Server - POST | devices] updatedDevices: ${JSON.stringify(deviceData)}`)
        return await writeDevices(deviceData)
    } catch (e) {
        console.error('Error adding device:', e)
    }
}

async function deleteDevice (device) {
    const devices = await readDevices()
    const index = devices.indexOf(device)

    if (index === -1) {
        return {
            success: false,
        }
    }
    devices.splice(index, 1)
    return await writeDevices(devices)
}

async function editDevice (device) {
    const devices = await readDevices()
    const editedDevices = devices.map( oldDevice => {
        if (oldDevice.id === device.id) {
            return {
                ...oldDevice, name: device.name, ip: device.ip
            }
        }
        return oldDevice
    })
    return await writeDevices(editedDevices)
}

module.exports = {getDevices, addDevice, deleteDevice, editDevice}