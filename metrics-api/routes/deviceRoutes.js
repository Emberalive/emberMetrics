const express = require('express')
const {getDevices, editDevice, addDevice, deleteDevice} = require("../opModules/device");
const {updateUser} = require("../opModules/user");
const router = express.Router()

router.get('/', async (req, res) => {
    console.log("[Server - GET | devices] starting route access")
    try {
        const devices = await getDevices()
        if (!devices) {
            console.log("[Server - GET | devices] no devices stored on API")
            res.status(500).json('Devices Data not available')
        } else {
            console.log("[Server - GET | devices] devices sent to client")
            res.status(200).json(devices)
        }
    } catch (e) {
        console.log("[Server - GET | devices] failed")
        res.status(500).send({
            success: false,
        })
    }
})


async function retry(operation, attempts = 8) {
    let result
    let retry = 0

    do {
        try {
            result = await operation()
        } catch {
            result = {success: false}
        }

        retry++
    } while (!result.success && retry < attempts)

    return result
}

router.patch('/', async (req, res) => {
    console.log("[Server - PATCH | devices] starting route access")
    const {editedDevice, user, originalDevice} = req.body
    console.log('editedDevice:', JSON.stringify(editedDevice));
    console.log('user:', JSON.stringify(user));
    console.log('originalDevice', JSON.stringify(originalDevice));
    if (!editedDevice || !user || !originalDevice) {
        console.log("[Server - PATCH | devices] missing required request body fields")
        return res.status(400).send({success: false})
    }
    try {
        const editDeviceRes = await editDevice(editedDevice)
        if (editDeviceRes.success === true) {
            console.log("[Server - PATCH | devices] updated device successfully")
            const patchUserRes = await updateUser(user.username, user)
                if (patchUserRes.success === true) {
                    console.log("[Server - PATCH | devices] device edit and user updated successfully")
                    return res.status(200).json(patchUserRes)
                } else {
                    const attempt = await retry(() => editDevice(originalDevice), 8)
                    if (attempt.success === true) {
                        console.log(`[Server - PATCH | devices] device: ${originalDevice.name} rolledBack after unsuccessful user patch`)
                        return res.status(500).json({
                            success: false,
                        })
                    }
                    console.error("[Server - PATCH | devices] rollback failed")
                    return res.status(500).json({ success: false })
                }
        } else {
            console.log('[Server - PATCH | devices] could not edit device')
            return res.status(500).send(editDeviceRes)
        }
    } catch (e) {
        console.log("[Server - PATCH | devices] internal error:", e)
        res.status(500).send({success: false})
    }
})

router.post('/', async (req, res) => {
    console.log("[Server - POST | devices] starting route access")
    const {device, user} = req.body
    if (!device || !user) {
        console.log("[Server - POST | devices] please specify deviceId")
        return res.status(400).send({success: false})
    }
    try {
        const addDeviceRes = await addDevice(device)
        if (addDeviceRes.success) {
            console.log("[Server - POST | devices] added device successfully")
            const patchUserRes = await updateUser(user.username, user)
            if (patchUserRes.success === true) {
                console.log("[Server - POST | devices] updated user devices with new device: ", JSON.stringify(device))
                return res.status(200).json(patchUserRes)
            } else {
                const attempt = await retry(() => deleteDevice(device.id), 8)
                if (attempt.success === true) {
                    console.log(`[Server - POST | devices] device: ${device.name} rolledBack after unsuccessful user patch`)
                    return res.status(500).json({
                        success: false,
                    })
                }
                console.log("[Server - POST | devices] rollback failed")
                return res.status(500).json({ success: false})
            }
        } else {
            console.log('[Server - POST | devices] device could not be added:', device)
            return res.status(500).send(addDeviceRes)
        }
    } catch (e) {
        console.log("[Server - POST | devices] internal error:", e)
        res.status(500).send({success: false})
    }
})

router.delete('/', async (req, res) => {
    console.log("[Server - DELETE | devices] starting route access")
    const {deviceId, user, originalDevice} = req.body
    if (!deviceId || !user || !originalDevice) {
        console.log("[Server - DELETE | devices] please specify deviceId")
        return res.status(400).send({
            success: false,
        })
    }
    try {
        const deleteDeviceRes = await deleteDevice(deviceId)
        if (deleteDeviceRes.success) {
            console.log("[Server - DELETE | devices] deleted device successfully")
            const patchUserRes = await updateUser(user.username, user)
            if (patchUserRes.success === true) {
                console.log("[Server - DELETE | devices] updated user device successfully")
                return res.status(200).json(patchUserRes)
            } else {
                const attempt = await retry(() => addDevice(originalDevice), 8)
                if (attempt.success === true) {
                    console.log(`[Server - DELETE | devices] device: ${originalDevice.name} rolledBack after unsuccessful user patch`)
                    return res.status(500).json({
                        success: false,
                    })
                }
            }
        } else {
            console.log('[Server - DELETE | devices] device could not be deleted')
            return res.status(500).json({
                success: false,
            })
        }
    } catch (e) {
        console.log('[Server - DELETE | devices] internal error:', e)
        res.status(500).send({
            success: false,
        })
    }
})

module.exports = router