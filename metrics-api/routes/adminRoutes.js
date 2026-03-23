const express = require('express')
const router = express.Router()
const { addFireWallRule, runSoftwareOperation } = require('../opModules/admin')
const {checkDeviceStructure, generateLogs, returnReads } = require('../opModules/utils')
const {findDevice} = require("../opModules/device");
const {checkDevicePerm} = require("../opModules/user");

//run a command on the machine
router.post("/software", async (req, res) => {
    console.log('[ Server - admin /software ] Endpoint started')
    const {packageName, packageManager, device, operation, user} = req.body;
    const PACKAGE_REGEX = /^[a-zA-Z0-9.+:-]+$/;

    console.log('[ Server - admin /software ] doing sanitation checks')

    if (user) {
        const allowed = checkDevicePerm(user.id, device.id)
        if (!allowed) {
            console.log('[ Server - admin /software ] User is not allowed to access this device')
            return res.status(401).send({success: false})
        }
    }

    if (!device || !checkDeviceStructure(device)) return res.status(400).send({success: false})

    if (!packageName || !packageManager || !operation) return res.status(400).send({success: false})
    //package sanitization
    if (!PACKAGE_REGEX.test(packageName) || !PACKAGE_REGEX.test(packageName)) return res.status(400).send({success: false})

    if (device.isHost) {
        console.log('[ Server - admin /software ] managing software locally')

        const result = runSoftwareOperation(packageName, packageManager, operation);

        if (!result || !result.success) return res.status(500).send({ success: false })

        const subProcess = result.process;

        res.status(200);

        console.log(`[ Server - Host API ] starting install logs`)
        generateLogs(subProcess, res)
        return
    }
    console.log(`[ Server - admin /software ] Installing on remote-device: ${device.name}`)

    const found = await findDevice(device.id)
    if (!found.success) {
        console.log('[ Server - admin /software ] Device does not exist')
        return res.status(404).send({success: false})
    }

    try {
        console.log(`[ Server - admin /software ] running operation: ${operation} - On remote-device: ${device.name}`)
        const response = await fetch(`http://${device.ip}:3000/admin/software`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                packageName: packageName,
                packageManager: packageManager,
                operation: operation,
            })
        })

        if (response.ok) {
            if (await returnReads(response, res)) return
            res.status(500).send({success: false})
        }
    } catch (e) {
        console.error(e.message)
        res.status(500).send({success: false})
    }
})

function needPort (rule) {
    return rule === "allow" || rule === "deny";
}

router.post("/fireWallRule", async (req, res) => {
    console.log('[ Server - admin /firewall ] starting endpoint')
    const allowedRules = [
        'allow','deny', 'default allow incoming', 'default deny incoming', 'default allow outgoing', 'default deny outgoing'
    ]
    const {chosenPort, rule, device, user} = req.body;

    if (user) {
        const allowed = checkDevicePerm(user.id, device.id)
        if (!allowed) {
            console.log('[ Server - admin /firewall ] User is not allowed to access this device')
            return res.status(401).send({success: false})
        }
    }

    console.log('[ Server - admin /firewall ] doing sanitation checks')
    if (!device || !checkDeviceStructure(device)) return res.status(400).send({success: false})
    if (!rule || !allowedRules.includes(rule)) {
        console.log('[ Server - admin /firewall ] rule is not allowed');
        return res.status(400).send({ success: false });
    }

    const needAport = needPort(rule);

    if (needAport) {
        if (chosenPort <= 0 || chosenPort > 65535) return res.status(400).send({success: false})
    }

    if (device.isHost) {
        console.log('[ Server - admin /firewall ] Creating rule locally')

        let result

        if (needAport) {
            result = await addFireWallRule(rule, chosenPort)
        } else {
            result = await addFireWallRule(rule)
        }

        if (!result.success) return res.status(500).send({ success: false, reason: 'could not add firewall rule' });

        const subProcess = result.process;
        generateLogs(subProcess, res)
        return
    }

    const found = await findDevice(device.id)
    if (!found.success) {
        console.log('[ Server - admin /firewall ] device does not exist')
        return res.status(404).send({success: false})
    }

    console.log(`[ Server - admin /firewall ] creating rule on device: ${device.name}`)

    try {
        const response = await fetch(`http://${device.ip}:3000/admin/fireWallRule`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chosenPort: chosenPort,
                rule: rule,
            })
        })

        if (response.ok) {
            if (await returnReads(response, res)) return
            res.status(500).send({success: false})
        }
    } catch (e) {
        console.error(e.message)
        res.status(500).send({success: false, reason: e.message})
    }
})

module.exports = router