const express = require('express')
const router = express.Router()
const { runSoftwareOperation, addFireWallRule } = require('../opModule/admin')

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
    console.log('[ Server - POST /software ] endpoint starting')
    const {packageName, packageManager, operation} = req.body;
    const PACKAGE_REGEX = /^[a-zA-Z0-9.+:-]+$/;

    console.log('[ Server - POST /softwareInstall ] doing sanitation checks')

    if (!packageName || !packageManager || !operation) {
        console.log('[ Server - POST /softwareInstall ] Please send all parameters')
        return res.status(400).send({success: false})
    }
    //package sanitization
    if (!PACKAGE_REGEX.test(packageName) || !PACKAGE_REGEX.test(packageName)) {
        console.log('[ Server - POST /software ] Command sanitation critical fault - failed checks')
        return res.status(400).send({success: false})
    }

    console.log('[ Server - POST /software ] sanitation checks successful')

    const result = runSoftwareOperation(packageName, packageManager, operation)

    if (!result.success) {
        console.log('[ Server - POST /software ] Error - failed to spawn a process')
        return res.status(500).send({ success: false });
    }

    const subProcess = result.process;
    console.log('[ Server - POST /software ] Process has been spawned successfully')
    generateLogs(subProcess, res)
})

function needPort (rule) {
    return rule === "allow" || rule === "deny"
}

router.post("/fireWallRule", async (req, res) => {
    console.log('[ Server - admin /firewall ] starting endpoint')
    const allowedRules = [
        'allow','deny', 'default allow incoming', 'default deny incoming', 'default allow outgoing', 'default deny outgoing'
    ]
    const {chosenPort, rule} = req.body;

    console.log('[ Server - admin /firewall ] doing sanitation checks')
    if (!rule || !allowedRules.includes(rule)) {
        console.log('[ Server - admin /firewall ] rule is not allowed');
        return res.status(400).send({ success: false });
    }

    const needAport = needPort(rule);

    if (needAport) {
        if (chosenPort <= 0 || chosenPort > 65535) return res.status(400).send({success: false})
    }

    let result

    if (needAport) {
        result = await addFireWallRule(rule, chosenPort)
    } else {
        result = await addFireWallRule(rule)
    }

    if (!result.success) return res.status(500).send({ success: false, reason: 'could not add firewall rule' });

    const subProcess = result.process;
    generateLogs(subProcess, res)
})

module.exports = router