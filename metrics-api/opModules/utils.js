let thisIp = false;

async function getHostIp () {
    try {
        const response = await fetch(`http://api.ipify.org?format=json`)
        if (response.ok) {
            const resData = await response.json()
            thisIp = resData.ip
            console.log('[Server - getHostIp] IP address acquired: ', thisIp)
        }
    } catch (e) {
        console.error(`[ Server ] ERROR: \n${e.message}`)
    }
}

function getThisIp () {
    if(thisIp) return thisIp
    else return false
}

function checkDeviceStructure (device) {
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

function generateLogs(subProcess, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');
    console.log('|---------------------------------Logs-start------------------------------------|\n')
    res.write('|---------------------------------Logs-start------------------------------------|\n')
    let i = 0
    subProcess.stdout.on("data", (data) => {
        const output = data.toString().trim();
        console.log(`Log-${i++}:${output.trim()}`);
        res?.write(output);
    });

    subProcess.stderr.on("data", (data) => {
        const error = data.toString().trim();
        console.error(`\n${error}`);

        res?.write(error);
    });

    subProcess.on("close", (code) => {
        console.log('\n|---------------------------------Logs-end------------------------------------|\n' +
            `[ Server - Host API ] Process exited with code ${code} | Logs finished`)
        res.write('\n|---------------------------------Logs-end------------------------------------|\n' +
            `[ Server - Host API ] Process exited with code ${code} | Logs finished`);
        res?.end();
    });
}

async function returnReads (response, res) {
    console.log("[ Server - returnReads] Starting function\n")
    if (!response || !response.body) {
        console.log("[ Server - returnReads] failed to return reads")
        return false
    }
    res.status(200);
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let isDone = false;

    while(!isDone) {
        const {value, done} = await reader.read();
        isDone = done;

        if(value) {
            const chunk = decoder.decode(value, {stream: true});

            console.log(chunk)
            res.write(chunk);
        }
    }
    console.log("[ Server - returnReads ] Operation on remote-device completed");
    res.end()
    return true
}

async function retryRollbackDeviceOps(operation, attempts = 8) {
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

function getDiskSize(bytes) {
    if (!bytes) return false;

    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let i = 0;

    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }

    return bytes.toFixed(2) + units[i];
}

module.exports = {getHostIp, getThisIp, getDiskSize,
    checkDeviceStructure, generateLogs, returnReads, retryRollbackDeviceOps}