const express = require('express')
const router = express.Router()
const { addFireWallRule, runSoftwareOperation } = require('../opModules/admin')
const { getThisIp } = require('../opModules/utils')

function checkDevice (device) {
    const exampleDevice = {
        name: 'name',
        ip: 'ip',
        id: 'id'
    }

    if (typeof device !== 'object') {
        for (const property of Object.keys(exampleDevice)) {
            const hasProperty = device.hasOwnProperty(property)
            if (!hasProperty) {
                return false
            }
        }
        return false
    }
    return true
}

function generateLogs(subProcess) {
    console.log('|---------------------------------Logs-start------------------------------------|\n')
    let i = 0
    subProcess.stdout.on("data", (data) => {
        const output = data.toString().trim();
        console.log(`Log-${i++}:${output.trim()}`);
        // res.write(output);
    });

    subProcess.stderr.on("data", (data) => {
        const error = data.toString().trim();
        console.error(`\n${error}`);

        // res.write(error);
    });

    subProcess.on("close", (code) => {
        console.log('\n|---------------------------------Logs-end------------------------------------|')
        console.log(`[ Server - Host API ] Process exited with code ${code} | Logs finished`);
        // res.end();
    });
}

//run a command on the machine
router.post("/software", async (req, res) => {
    console.log('[ Server - admin /software ] Enpoint started')
    const {packageName, packageManager, device, operation} = req.body;
    const PACKAGE_REGEX = /^[a-zA-Z0-9.+:-]+$/;

    console.log('[ Server - admin /software ] doing sanitation checks')

    if (!device || !checkDevice(device)) return res.status(400).send({success: false})

    if (!packageName || !packageManager || !operation) return res.status(400).send({success: false})
    //package sanitization
    if (!PACKAGE_REGEX.test(packageName) || !PACKAGE_REGEX.test(packageName)) return res.status(400).send({success: false})

    if (device.ip === 'localhost' || device.ip === '127.0.0.1' || device === getThisIp()) {
        console.log('[ Server - admin /software ] managing software locally')

        const result = runSoftwareOperation(packageName, packageManager, operation);

        if (!result || !result.success) return res.status(500).send({ success: false })

        const subProcess = result.process;

        // res.setHeader("Content-Type", "text/plain");
        // res.status(200);

        console.log(`[ Server - Host API ] starting install logs`)
        generateLogs(subProcess)
        return res.status(200).send(result)
    }
    console.log(`[ Server - admin /software ] Installing on remote-device: ${device.name}`)

    let resData;

    try {
        console.log(`[ Server - admin /software ] running operation: ${operation} \n                             on remote-device: ${device.name}`)
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
            resData = await response.json()
            return res.status(200).send(resData)
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
    const {chosenPort, rule, device} = req.body;

    console.log('[ Server - admin /firewall ] doing sanitation checks')
    if (!device || !checkDevice(device)) return res.status(400).send({success: false})
    if (!rule || !allowedRules.includes(rule)) {
        console.log('[ Server - admin /firewall ] rule is not allowed');
        return res.status(400).send({ success: false });
    }

    const needAport = needPort(rule);

    if (needAport) {
        if (chosenPort <= 0 || chosenPort > 65535) return res.status(400).send({success: false})
    }

    if (device.ip === 'localhost' || device.ip === '127.0.0.1' || device === getThisIp()) {
        console.log('[ Server - admin /firewall ] Creating rule locally')

        let result

        if (needAport) {
            result = await addFireWallRule(rule, chosenPort)
        } else {
            result = await addFireWallRule(rule)
        }

        if (!result.success) return res.status(500).send({ success: false, reason: 'could not add firewall rule' });

        const subProcess = result.process;
        generateLogs(subProcess)

        return res.status(200).send(result)
    }

    console.log(`[ Server - admin /firewall ] creating rule on device: ${device.name}`)

    let resData;

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
        resData = await response.json()

        if (response.ok) {
            return res.status(200).send(resData)
        }
        console.log(`Device: ${device.name} could not spawn a process\n`, JSON.stringify(resData))
        return res.status(500).send({success: false})
    } catch (e) {
        console.error(e.message)
        res.status(500).send({success: false, reason: e.message})
    }
})

module.exports = router