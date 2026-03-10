const express = require('express')
const router = express.Router()
const { runSoftwareInstall } = require('../opModule/admin')

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

//run a command on the machine
router.post("/softwareInstall", async (req, res) => {
    const {packageName, packageManager, device} = req.body;
    const PACKAGE_REGEX = /^[a-zA-Z0-9.+:-]+$/;

    if (!device || checkDevice(device)) return res.status(400).send({success: false})

    if (!packageName || !packageManager) return res.status(400).send({success: false})
    //package sanitization
    if (!PACKAGE_REGEX.test(packageName) || !PACKAGE_REGEX.test(packageName)) return res.status(400).send({success: false})

    const result = runSoftwareInstall(packageName, packageManager, device)

    if (!result.success) {
        return res.status(500).send({ success: false });
    }

    const subProcess = result.process;

    // res.setHeader("Content-Type", "text/plain");
    // res.status(200);

    console.log(`[ Server - Host API ] starting install logs`)
    console.log('|---------------------------------Logs-start------------------------------------|')
    let i = 0
    subProcess.stdout.on("data", (data) => {
        const output = data.toString().trim();
        console.log(`Log-${i++}:${output}`);
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
})

module.exports = router