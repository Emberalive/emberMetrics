const express = require('express')
const {getDevices, editDevice, addDevice, deleteDevice} = require("../opModules/device");
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

router.patch('/', async (req, res) => {
    console.log("[Server - PATCH | devices] starting route access")
    const device = req.body.device
    if (!device) {
        console.log("[Server - PATCH | devices] please specify deviceId")
        res.status(400).send({success: false})
    } else {
        try {
            const response = await editDevice(device)
            if (response.success === true) {
                res.status(200).send(response)
            } else {
                res.status(500).send(response)
            }
        } catch (e) {
            console.log("[Server - PATCH | devices] internal error:", e)
            res.status(500).send({success: false})
        }
    }
})

router.post('/', async (req, res) => {
    console.log("[Server - POST | devices] starting route access")
    const device = req.body.device
    if (!device) {
        console.log("[Server - POST | devices] please specify deviceId")
        res.status(400).send({success: false})
    } else {
        try {
            const response = await addDevice(req.body.device)
            if (!response.success) {
                console.log('[Server - POST | devices] failed to add device')
                res.status(500).send({
                    success: false,
                })
            } else {
                console.log('[Server - POST | devices] added device with deviceId:', device.id)
                res.status(200).send(response)
            }
        } catch (e) {
            console.log("[Server - POST | devices] internal error:", e)
            res.status(500).send({success: false})
        }
    }
})

router.delete('/', async (req, res) => {
    console.log("[Server - DELETE | devices] starting route access")
    const deviceId = req.body.deviceID
    if (!deviceId) {
        console.log("[Server - DELETE | devices] please specify deviceId")
        res.status(400).send({
            success: false,
        })
    } else {
        try {
            const response = await deleteDevice(deviceId)
            if (response.success) {
                res.status(200).json(response)
            } else {
                res.status(500).json({
                    success: false,
                })
            }
        } catch (e) {
            console.log('[Server - DELETE | devices] internal error:', e)
            res.status(500).send({
                success: false,
            })
        }
    }
})

module.exports = router