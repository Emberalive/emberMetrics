const os = require('os')
const si = require('systeminformation')
const express = require('express')
const nSmi = require("node-nvidia-smi");
const fs = require('fs').promises;

const app = express()
const cors = require('cors')


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

async function getAmdGpuData() {
    const drm = await fs.readdir('/sys/class/drm');
    const findGraphicsCard = drm.find(entry => /^card\d+$/.test(entry));
    const gpuDataPath = `/sys/class/drm/${findGraphicsCard}/device`;
    const findSensorSymLink = await fs.readdir(`${gpuDataPath}/hwmon`);
    const sensorPath = `${gpuDataPath}/hwmon/${findSensorSymLink[0]}`;

    const readFile = async (path) => {
        try {
            const val = await fs.readFile(path, 'utf8')
            return val.trim()
        } catch {
            return null
        }
    }

    const readSclk = async () => {
        try {
            const val = await fs.readFile(`${gpuDataPath}/pp_dpm_sclk`, 'utf8')
            const activeLine = val.trim().split('\n').find(line => line.includes('*'))
            const match = activeLine.match(/(\d+)Mhz/)
            return match ? parseInt(match[1]) : null
        } catch {
            return null
        }
    }

    const [
        temp,
        fanSpeed,
        powerDraw,
        powerCap,
        computeClock,
        memClock,
        gpuUtil,
        memUtil,
        vramTotal,
        vramUsed
    ] = await Promise.all([
        readFile(`${sensorPath}/temp2_input`),
        readFile(`${sensorPath}/fan1_input`),
        readFile(`${sensorPath}/power1_average`),
        readFile(`${sensorPath}/power1_cap`),
        readSclk(),
        readFile(`${sensorPath}/freq2_input`),
        readFile(`${gpuDataPath}/gpu_busy_percent`),
        readFile(`${gpuDataPath}/mem_busy_percent`),
        readFile(`${gpuDataPath}/mem_info_vram_total`),
        readFile(`${gpuDataPath}/mem_info_vram_used`),
    ])

    return {
        temp: temp ? `${Math.round(parseInt(temp) / 1000)} ℃` : await readFile(`${sensorPath}/temp1_input`) ?
            await readFile(`${sensorPath}/temp1_input`) : null,                             // millidegrees -> °C
        fanSpeed: fanSpeed ? `${parseInt(fanSpeed)} RPM` : null,                                 // already RPM
        powerDraw: powerDraw ? `${Math.round(parseInt(powerDraw) / 1000000)} W` : null,       // microwatts -> W
        powerCap: powerCap ? `${Math.round(parseInt(powerCap) / 1000000)} W` : null,          // microwatts -> W
        clocks: {
            gfx: computeClock ? `${computeClock} MHz` : null, // Hz -> MHz
            mem: memClock ? `${Math.round(parseInt(memClock) / 1000000)} MHz` : null,         // Hz -> MHz
        },
        util: {
            gpu: gpuUtil ? `${parseInt(gpuUtil)} %` : null,                                      // already %
            mem: {
                percent: memUtil ? `${parseInt(memUtil)} %` : null,                              // already %
                total: vramTotal ? getDiskSize(parseInt(vramTotal)) : null,                      // bytes
                used: vramUsed ? getDiskSize(parseInt(vramUsed)) : null,                         // bytes
            }
        }
    }
}


let isPolling = false;
let pollingTimeOut

let metrics = {}
let childLength = 0
let deviceData
let oldCpus = os.cpus()

async function monitorGraphics() {
    try {
        const data = await si.graphics();
        const vendor =data.controllers[0]?.vendor;

        if (vendor.includes('AMD')) {
            return getAmdGpuData()
        } else {
            return new Promise((resolve, reject) => {
                nSmi(function (err, data) {
                    if (err) {
                        console.log(err)
                        return reject(err);
                    }
                    resolve(data)
                    console.log(`NVIDIA: ${JSON.stringify(data, null, 2)}`);
                })
            })
        }
    } catch (err) {
        console.error(`There was an issue monitoring the gpu:\n ${err.message}`)
    }
}

try {
    deviceData = [
        { label: 'Platform', value: os.platform() },
        { label: 'Name', value: os.type() },
        { label: 'Release', value: os.release() },
        { label: 'Architecture', value: os.arch() },
        { label: 'Version', value: os.version() },
    ];
} catch (e) {
    console.error(`There was an issue gathering device data:\n ${e.message}`)
}

async function getNetworkInterfaces () {
    try {
        const data = await si.networkInterfaces()
        return data.map(interfaceObject => ({
            name: interfaceObject.iface,
            default: interfaceObject.default,
            mac: interfaceObject.mac,
            type: interfaceObject.type,
            addresses:{
                ip4: interfaceObject.ip4,
                ip6: interfaceObject.ip6,
            },
        }))
    } catch (e) {
        console.error(`There was an error getting the interfaces\n ${e.message}`)
    }
}

async function getInterfaceData () {
    try {
        const interfaces = await getNetworkInterfaces()

        return (await Promise.all(
            interfaces.map(async interfaceObject => {
                const [stats] = await si.networkStats(interfaceObject.name)
                return {
                    name: interfaceObject.name,
                    default: interfaceObject.default,
                    mac: interfaceObject.mac,
                    type: interfaceObject.type,
                    addresses: interfaceObject.addresses,
                    data: {
                        transmitted: stats.tx_sec ? stats.tx_sec.toFixed(2) : '0.00',
                        received: stats.rx_sec ? stats.rx_sec.toFixed(2) : '0.00',
                    }
                }
            })
        )).reverse()
    } catch (e) {
        console.error('Error fetching network stats:', e);
    }
}

async function getChildProcesses () {
    try {
        const {list} = (await si.processes())
        const childProcesses = list.map(process => {
            return {
                pid: process.pid ? process.pid : 'unknown',
                name: process.name,
                cpu: process.cpu,
                memory: process.mem,
                user: process.user
            }
        })
        childProcesses.sort((a, b) => b.cpu - a.cpu)
        if (childProcesses.length > 0) {
            if (childLength === 0) {
                return childProcesses.splice(0, 10)
            } else {
                if (typeof childLength === 'number') {
                    return childProcesses.splice(0, childLength)
                } else {
                    return childProcesses.splice(0, 10)
                }
            }
        } else {
            return childProcesses.sort((a, b) => b.cpu - a.cpu);
        }
    } catch (e) {
        console.error(`There was an issue monitoring the child processes:\n ${e.message}`)
    }
}

async function getCpuTemperature() {
    try {
        const temps = await si.cpuTemperature()
        const mainTemp = temps.main
        const maxTemp = temps.max

        if (mainTemp || maxTemp) {
            if (mainTemp === maxTemp) {
                return {
                    mainTemp: mainTemp,
                    maxTemp: null,
                }
            }
            return {
                main: mainTemp ? mainTemp : null,
                max: maxTemp ? maxTemp : null,
            }
        }
    } catch (e) {
        console.error(`There was an issue monitoring the cpu temps:\n ${e.message}`)
    }
}

async function getMemory() {
    try {
        const memoryAvailable = await (os.freemem() / os.totalmem()) * 100
        const memoryUsed = 100 - memoryAvailable
        return {
            available: memoryAvailable ? memoryAvailable.toFixed(2) : 'unknown',
            usage: memoryUsed ? memoryUsed.toFixed(2) : 'unknown',
        }
    } catch (e) {
        console.error(`There was an issue monitoring the memory:\n ${e.message}`)
    }
}

async function getCpu () {
    try {
        const newCpus = os.cpus()
        const cpuUsagePercentage = []

        for (let i = 0; i < newCpus.length; i++) {
            const oldTimes = oldCpus[i].times
            const newTimes = newCpus[i].times

            const deltaUser = newTimes.user - oldTimes.user;
            const deltaNice = newTimes.nice - oldTimes.nice;
            const deltaSys = newTimes.sys - oldTimes.sys;
            const deltaIdle = newTimes.idle - oldTimes.idle;
            const deltaIrq = newTimes.irq - oldTimes.irq;

            const total = deltaUser + deltaNice + deltaSys + deltaIdle + deltaIrq;
            const usage = total > 0
                ? ((total - deltaIdle) / total) * 100
                : 0;


            cpuUsagePercentage.push({
                usage: usage.toFixed(2),
                no: i + 1
            });
        }

        oldCpus = newCpus
        let totalCPU = cpuUsagePercentage.reduce(
            (sum, cpu) => sum + parseInt(cpu.usage), 0) / cpuUsagePercentage.length

        return {
            cores: cpuUsagePercentage,
            total: totalCPU ? totalCPU.toFixed(2) : 0,
            temps: await getCpuTemperature()
        }
    } catch (e) {
        console.error(`There was an issue gathering CPU data:\n ${e.message}`)
    }
}

async function getDiskInfo () {
    try {
        const disks = await si.diskLayout()
        const diskList = disks.map((disk) => {
            return {
                name: disk.name ? disk.name : 'unknown',
                type: disk.type ? disk.type : 'unknown',
                vendor: disk.vendor ? disk.vendor : 'unknown',
                device: disk.device ? disk.device : 'unknown',
                size: getDiskSize(disk.size) ? getDiskSize(disk.size) : 'unknown',
                interfaceType: disk.interfaceType ? disk.interfaceType : 'unknown',
            }
        })

        const diskUsage = await si.disksIO()

        const stats = await si.fsStats();
        return {
            totalDiskUsage: {
                rIO: diskUsage.rIO,
                wIO: diskUsage.wIO,
                rIO_sec: diskUsage.rIO_sec ? diskUsage.rIO_sec.toFixed(2) : 0.00,
                wIO_sec: diskUsage.wIO_sec ? diskUsage.wIO_sec.toFixed(2) : 0.00,
                rx_sec: stats.rx_sec,
                wx_sec: stats.wx_sec,
            },
            disks: diskList,
        }
    } catch (e) {
        console.error(`There was an issue monitoring the disk:\n ${e.message}`)
    }
}

setInterval(async () => {
    if (isPolling) {
        console.log(`[Server - metrics] auto re-gather when polling is true`)
        try {
            metrics = {
                hostName: os.hostname(),
                deviceData: deviceData,
                memoryUsage: await getMemory(),
                cpuUsage: await getCpu(),
                gpuData: await monitorGraphics(),
                childProcesses: await getChildProcesses(),
                interfaces: await getInterfaceData(),
                disks: await getDiskInfo()
            }
        } catch (e) {
            console.error(`There was an issue gathering interval:\n ${e.message}`)
        }
    } else {
        console.log(`[Server - metrics] is not gathering due to no active polling`)
    }
}, 1000)

function getMetrics () {
    //if polling timeout exist clear it and make a new one
    if (pollingTimeOut) {
        console.log(`[Server - metrics] clearing the timeout due to new polling request`)
        clearInterval(pollingTimeOut)
    }
    console.log(`[Server - metrics] starting new timeout for polling request`)
    //else create a polling time out
    pollingTimeOut = pollingTimeOut = setTimeout(() => {
        isPolling = false;
        //sets a timeout for between requests - prevents un-necessary gathering
    }, 30000)
    //set polling to true
    isPolling = true
    return metrics
}

function setChildLength (length) {
    childLength = length
}


const port = 3000

const adminRoutes = require('./routes/adminRoutes')

app.use(express.json())
app.use(cors({
    origin: "*",
    methods: ["GET", "HEAD", "OPTIONS", "POST","DELETE", "PATCH"],
}));

app.use('/admin', adminRoutes)

//returns the metrics
app.post('/', (req, res) => {
    const metrics = getMetrics();
    const childLength = req.body.childLength
    if (!metrics || (typeof metrics === 'object' && Object.keys(metrics).length === 0)) {
        console.log('[ Server - /getMetrics ] failed to get metrics')
        return res.status(500).json({ reason: 'Metrics Data not available', success: false });
    }
    const parsed = parseInt(childLength, 10)
    if (!childLength) return res.status(500).json({ reason: 'Invalid child length', success: false });
    if (typeof parsed === 'number') {
        setChildLength(parsed);
    } else {
        console.log('[ Server - /getMetrics ] no childLength available')
        return res.status(500).json({ reason: 'Invalid child length', success: false });
    }
    res.status(200).json({
        success: true,
        metrics: metrics,
    }); // always send JSON
});

app.listen(port, async () => {
    console.log(`[Server] API Listening on port ${port}`)
})