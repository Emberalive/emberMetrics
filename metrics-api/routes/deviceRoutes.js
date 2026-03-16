const express = require('express')
const {getDevices, editDevice, addDevice, deleteDevice} = require("../opModules/device");
const {updateUser} = require("../opModules/user");
const { retryRollbackDeviceOps } = require("../opModules/utils");
const router = express.Router()

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

    const userRes = await userOperation()

    if (userRes.success) {
        console.log(successLog)
        return userRes
    }

    const rollback = await retryRollbackDeviceOps(rollbackOperation, 8)

    if (rollback.success) {
        console.log(rollbackLog)
    }

    return { success: false, stage: "user" }
}

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

router.patch('/', async (req, res) => {
    console.log("[Server - PATCH | devices] starting route access")
    const {editedDevice, user, originalDevice} = req.body
    if (!editedDevice || !user || !originalDevice) {
        console.log("[Server - PATCH | devices] missing required request body fields")
        return res.status(400).send({success: false})
    }

    try {
        const result = await deviceTransaction({
            deviceOperation: () => editDevice(editedDevice),
            userOperation: () =>  updateUser(user.username, user),
            rollbackOperation: () => editDevice(originalDevice),
            rollbackLog: `[Server - PATCH | devices] device: ${originalDevice.name} rolledBack after unsuccessful user`,
            successLog: `[Server - PATCH | devices] device edit and user updated successfully`
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
    if (!device || !user) {
        console.log("[Server - POST | devices] please specify deviceId")
        return res.status(400).send({success: false})
    }

    try {
        const result = await deviceTransaction({
            deviceOperation: () => addDevice(device),
            userOperation: () => updateUser(user.username, user),
            rollbackOperation: () => deleteDevice(device.id),
            rollbackLog: `[Server - PATCH | devices] rolledBack device: ${device.id}`,
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
    if (!deviceId || !user || !originalDevice) {
        console.log("[Server - DELETE | devices] please specify deviceId")
        return res.status(400).send({
            success: false,
        })
    }

    try {
        const result = await deviceTransaction({
            deviceOperation: () => deleteDevice(deviceId),
            userOperation: () => updateUser(user.username, user),
            rollbackOperation: () => addDevice(originalDevice),
            rollbackLog: `[Server - DELETE | devices] deleted device: ${deviceId} successfully`,
            successLog: `[Server - DELETE | devices] deleted device: ${deviceId} successfully`
        })

        if (result.success) {
            return res.status(200).json(result)
        }

        return res.status(500).send({success: false})
    } catch (e) {
        console.log('[Server - DELETE | devices] internal error:', e)
        res.status(500).send({success: false})
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
                const attempt = await retryRollbackDeviceOps(() => addDevice(originalDevice), 8)
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
        res.status(500).send({success: false})
    }
})

module.exports = router