const express = require('express')
const {getDevices, editDevice, addDevice, deleteDevice} = require("../opModules/device");
const {updateUser, checkDevicePerm} = require("../opModules/user");
const {authenticate} = require("../opModules/sessionMiddleware");
const router = express.Router()

router.use(authenticate);

router.get('/', async (req, res) => {
    console.log("[Server - GET | devices] starting route access")
    try {
        const devices = await getDevices()
        if (!devices) {
            console.log("[Server - GET | devices] no devices stored on API")
            res.status(500).json({success: false})
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


async function deviceTransaction({
     deviceOperation,
     rollbackOperation,
     userOperation,
     successLog,
     rollbackLog
 }) {

    const deviceRes = await deviceOperation()

    if (!deviceRes.success) {
        return { success: false, stage: "device" }
    }

    let userRes

    if (userOperation === 'none') {
        console.log("[Server - deviceTransaction | devices ] Client does not use Users - bypassing user operation")
        userRes = {success: true}
    } else {
        userRes = await userOperation()
    }

    if (userRes.success) {
        console.log(successLog)
        return userRes
    }

    const rollback = await retry(rollbackOperation, 8)

    if (rollback.success) {
        console.log(rollbackLog)
    }

    return { success: false, stage: "user" }
}

router.patch('/', async (req, res) => {
    console.log("[Server - PATCH | devices] starting route access")
    const {editedDevice, user, originalDevice} = req.body
    if (!editedDevice || !originalDevice) {
        console.log("[Server - PATCH | devices] missing required request body fields")
        return res.status(400).send({success: false})
    }

    if (user) {
        console.log("[Server - PATCH | devices] user exists - checking device permissions")
        const allowed = await checkDevicePerm(user.id, originalDevice.id)
        if (!allowed) {
            console.log('[ Server - PATCH | devices] User is not allowed to access this device')
            return res.status(403).send({success: false})
        }
    }

    try {
        const result = await deviceTransaction({
            deviceOperation: () => editDevice(editedDevice),
            userOperation: user !== null ? () => updateUser(user.username, user) : 'none',
            rollbackOperation: () => editDevice(originalDevice),
            rollbackLog: `[Server - PATCH | devices] Device: ${originalDevice.name} rolledBack after unsuccessful user operation`,
            successLog: `[Server - PATCH | devices] Device edit and user updated successfully`
        })

        if (result.success) {
            return res.status(200).send(result)
        }

        return res.status(500).send({success: false})
    } catch (e) {
        console.log("[Server - PATCH | devices] internal error:", e)
        res.status(500).send({success: false})
    }
})

router.post('/', async (req, res) => {
    console.log("[Server - POST | devices] starting route access")
    const {device, user} = req.body
    if (!device) {
        console.log("[Server - POST | devices] please specify deviceId")
        return res.status(400).send({success: false})
    }

    try {
        const result = await deviceTransaction({
            deviceOperation: () => addDevice(device),
            userOperation: user !== null ? () => updateUser(user.username, user): 'none',
            rollbackOperation: () => deleteDevice(device.id),
            rollbackLog: `[Server - PATCH | devices] Device: ${device.id} rolledBack after unsuccessful user operation`,
            successLog: `[Server - POST | devices] created device successfully`
        })

        if (result.success) {
            return res.status(200).json(result)
        }
        return res.status(500).send({success: false})

    } catch (e) {
        console.log("[Server - POST | devices] internal error:", e)
        res.status(500).send({success: false})
    }
})

router.delete('/', async (req, res) => {
    console.log("[Server - DELETE | devices] starting route access")
    const {deviceId, user, originalDevice} = req.body
    if (!deviceId || !originalDevice) {
        console.log("[Server - DELETE | devices] please specify deviceId")
        return res.status(400).send({
            success: false,
        })
    }

    if (user) {
        const allowed = await checkDevicePerm(user.id, deviceId)
        if (!allowed) {
            console.log("[Server - DELETE | devices] user is not allowed ot access this device")
            return res.status(403).send({success: false})
        }
    }

    try {
        const result = await deviceTransaction({
            deviceOperation: () => deleteDevice(deviceId),
            userOperation: user !== null ? () => updateUser(user.username, user) : 'none',
            rollbackOperation: () => addDevice(originalDevice),
            rollbackLog: `[Server - DELETE | devices] Device: ${deviceId} rolledBack after unsuccessful user operation`,
            successLog: `[Server - DELETE | devices] Deleted device: ${deviceId} successfully`
        })

        if (result.success) {
            return res.status(200).json(result)
        }

        return res.status(500).send({success: false})
    } catch (e) {
        console.log('[Server - DELETE | devices] internal error:', e)
        res.status(500).send({success: false})
    }
})

module.exports = router