const express = require('express')
const router = express.Router()
const { runSoftwareInstall } = require('../opModule/admin')

//run a command on the machine
router.post("/", async (req, res) => {
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

    return res.status(200).send(runSoftwareInstall(packageName, packageManager, device))
})

module.exports = router