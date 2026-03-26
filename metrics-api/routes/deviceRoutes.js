const express = require('express')
const {getDevices, editDevice, addDevice, deleteDevice, findDevice} = require("../opModules/device");
const {updateUser, checkDevicePerm} = require("../opModules/user");
const {authenticate} = require("../opModules/sessionMiddleware");
const {generateLogs, checkDeviceStructure, returnReads} = require("../opModules/utils");
const {addFireWallRule, runSoftwareOperation} = require("../opModules/admin");
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

    const userRes = await userOperation()

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

    console.log("[Server - PATCH | devices] user exists - checking device permissions")
    const allowed = await checkDevicePerm(user.id, originalDevice.id)
    if (!allowed) {
        console.log('[ Server - PATCH | devices] User is not allowed to access this device')
        return res.status(403).send({success: false})
    }

    try {
        const result = await deviceTransaction({
            deviceOperation: () => editDevice(editedDevice),
            userOperation: () => updateUser(user.username, user),
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
            userOperation: () => updateUser(user.username, user),
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

    const allowed = await checkDevicePerm(user.id, deviceId)
    if (!allowed) {
        console.log("[Server - DELETE | devices] user is not allowed ot access this device")
        return res.status(403).send({success: false})
    }

    try {
        const result = await updateUser(user.username, user)

        if (result.success) {
            console.log(`[Server - DELETE | devices] Removed device: ${deviceId} successfully from user: ${user.username}`)
            return res.status(200).json(result)
        }
        console.log(`[Server - DELETE | devices] update failed: ${JSON.stringify(result, null, 2)}`)

        return res.status(500).send({success: false})
    } catch (e) {
        console.log('[Server - DELETE | devices] internal error:', e)
        res.status(500).send({success: false})
    }
})

//run a command on the machine
router.post("/software", async (req, res) => {
    console.log('[ Server - admin /software ] Endpoint started')
    const {packageName, packageManager, device, operation, user} = req.body;
    const PACKAGE_REGEX = /^[a-zA-Z0-9.+:-]+$/;

    console.log('[ Server - admin /software ] doing sanitation checks')

    if (user) {
        const allowed = await checkDevicePerm(user.id, device.id)
        if (!allowed) {
            console.log('[ Server - admin /software ] User is not allowed to access this device')
            return res.status(403).send({success: false})
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
        const allowed = await checkDevicePerm(user.id, device.id)
        if (!allowed) {
            console.log('[ Server - admin /firewall ] User is not allowed to access this device')
            return res.status(403).send({success: false})
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