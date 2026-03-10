const express = require('express')
const router = express.Router()
const { runSoftwareInstall } = require('../opModule/admin')

//run a command on the machine
router.post("/softwareInstall", async (req, res) => {
    console.log('[ Server - POST /softwareInstall ] endpoint starting')
    const {packageName, packageManager} = req.body;
    const PACKAGE_REGEX = /^[a-zA-Z0-9.+:-]+$/;

    console.log('[ Server - POST /softwareInstall ] doing sanitation checks')

    if (!packageName || !packageManager) {
        console.log('[ Server - POST /softwareInstall ] Please send all parameters')
        return res.status(400).send({success: false})
    }
    //package sanitization
    if (!PACKAGE_REGEX.test(packageName) || !PACKAGE_REGEX.test(packageName)) {
        console.log('[ Server - POST /softwareInstall ] Command sanitation critical fault - failed checks')
        return res.status(400).send({success: false})
    }

    console.log('[ Server - POST /softwareInstall ] sanitation checks successful')

    const result = runSoftwareInstall(packageName, packageManager)

    if (!result.success) {
        console.log('[ Server - POST /softwareInstall ] Error - failed to spawn a process')
        return res.status(500).send({ success: false });
    }

    const subProcess = result.process;
    console.log('[ Server - POST /softwareInstall ] Process has been spawned successfully')

    // res.setHeader("Content-Type", "text/plain");
    // res.status(200);

    console.log(`[ Server - Host API ] starting install logs`)
    console.log('|---------------------------------Logs-start------------------------------------|')
    let i = 0
    subProcess.stdout.on("data", (data) => {
        const output = data.toString().trim();
        console.log(`\nLog-${i++}:${output.trim()}\n`);
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