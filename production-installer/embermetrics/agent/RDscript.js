const os = require('os')
const si = require('systeminformation')
const express = require('express')
const app = express()

const cors = require('cors')

let metrics = {}
let childLength = 0
let deviceData
let oldCpus = os.cpus()

async function monitorGraphics() {
    try {
        const data = await si.graphics();

        let gpus = []

        data.controllers.forEach((gpu, index) => {
            const gpuData = {
                model: gpu.model,
                memory: {
                    used: gpu.memoryUsed !== undefined ? gpu.memoryUsed : 'N/A',
                    total: gpu.memoryTotal !== undefined ? gpu.memoryTotal : 'N/A',
                    free: gpu.memoryFree !== undefined ? gpu.memoryFree : 'N/A',
                    utilization: gpu.utilizationMemory !== undefined ? gpu.utilizationMemory : 'N/A',
                },
                utilization: gpu.utilizationGpu !== undefined ? gpu.utilizationGpu : 'N/A',
                temp: gpu.temperatureGpu !== undefined ? gpu.temperatureGpu : 'N/A',
                power: gpu.powerDraw !== undefined ? gpu.powerDraw : 'N/A',
                clocks: {
                    core: gpu.clockCore !== undefined ? gpu.clockCore : 'N/A',
                    memory: gpu.clockMemory !== undefined ? gpu.clockMemory : 'N/A',
                }
            }
            gpus.push(gpuData)
        })
        return gpus

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
        //this sorts the processes based on cpu usage
        childProcesses.sort((a, b) => b.cpu - a.cpu);
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
                size: (disk.size / (1024 ** 3)).toFixed(2).toString().length > 6 ? (disk.size / (1024 ** 4)).toFixed(2).toString() + 'TB': (disk.size / (1024 ** 3)).toFixed(2).toString() + 'GB',
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

//constantly updates metrics
const interval = setInterval(async () => {
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
}, 1000)

function getMetrics () {
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