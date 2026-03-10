const express = require('express')
const router = express.Router()
const { runSoftwareInstall } = require('../opModules/admin')
const { getThisIp } = require('../opModules/utils')

//run a command on the machine
router.post("/softwareInstall", async (req, res) => {
    const {packageName, packageManager, device} = req.body;
    const PACKAGE_REGEX = /^[a-zA-Z0-9.+:-]+$/;

    const exampleDevice = {
        name: 'name',
        ip: 'ip',
        id: 'id'
    }

    if (!device && typeof device !== 'object') {
        for (const property of Object.keys(exampleDevice)) {
            const hasProperty = device.hasOwnProperty(property)
            if (!hasProperty) {
                return res.status(400).send({success: false})
            }
        }
        return res.status(400).send({success: false})
    }

    if (!packageName || !packageManager) return res.status(400).send({success: false})
    //package sanitization
    if (!PACKAGE_REGEX.test(packageName) || !PACKAGE_REGEX.test(packageName)) return res.status(400).send({success: false})

    if (device.ip === 'localhost' || device.ip === '127.0.0.1' || device === getThisIp()) {
        return res.status(200).send(runSoftwareInstall(packageName, packageManager, device))
    }

    let resData;

    try {
        const response = await fetch(`http://${device.ip}:3000/admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                packageName: packageName,
                packageManager: packageManager,
                device: device,
            })
        })

        if (response.ok) {
            resData = await response.json()
            return res.status(200).send(resData)
        }
    } catch (e) {
        console.error(e.message)
        res.status(500).send({success: false})
    }
})

router.post("/fireWallRule", async (req, res) => {
    const {chosenPort, rule, device} = req.body;
    const PACKAGE_REGEX = /^[a-zA-Z0-9.+:-]+$/;

    const exampleDevice = {
        name: 'name',
        ip: 'ip',
        id: 'id'
    }

    if (!device && typeof device !== 'object') {
        for (const property of Object.keys(exampleDevice)) {
            const hasProperty = device.hasOwnProperty(property)
            if (!hasProperty) {
                return res.status(400).send({success: false})
            }
        }
        return res.status(400).send({success: false})
    }

    if (!chosenPort || !rule) return res.status(400).send({success: false})


    if (rule !== 'allow' || rule !== 'deny') {
        return res.status(400).send({success: false})
    }

    //rule sanitization
    if (!PACKAGE_REGEX.test(packageName) || !PACKAGE_REGEX.test(packageName)) return res.status(400).send({success: false})

    if (device.ip === 'localhost' || device.ip === '127.0.0.1' || device === getThisIp()) {
        return res.status(200).send(runSoftwareInstall(packageName, packageManager, device))
    }

    let resData;

    try {
        const response = await fetch(`http://${device.ip}:3000/admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                packageName: packageName,
                packageManager: packageManager,
                device: device,
            })
        })

        if (response.ok) {
            resData = await response.json()
            return res.status(200).send(resData)
        }
    } catch (e) {
        console.error(e.message)
        res.status(500).send({success: false})
    }
})

module.exports = router