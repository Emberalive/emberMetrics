const os = require('os')
const si = require('systeminformation')
const express = require('express')
const app = express()

const cors = require('cors')

let metrics = {}
let childData = []
let deviceData
let oldCpus = os.cpus()
//getting Device information
module.exports = metrics

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
        }))
    } catch (e) {
        console.error(`There was an error getting the interfaces\n ${e.message}`)
    }
}

async function getInterfaceData () {
    try {
        const interfaces = await getNetworkInterfaces()

        return await Promise.all(
            interfaces.map(async interfaceObject => {
                const [stats] = await si.networkStats(interfaceObject.name)
                return {
                    name: interfaceObject.name,
                    data: {
                        transmitted: stats.tx_sec ? stats.tx_sec.toFixed(2) : '0.00',
                        received: stats.rx_sec ? stats.rx_sec.toFixed(2): '0.00',
                    }
                }
            })
        )
    } catch (e) {
        console.error('Error fetching network stats:', e);
    }
}

async function getChildProcesses () {
    try {
        const {list} = (await si.processes())
        const childProcesses = list.map(process => {
            return {
                pid: process.pid,
                name: process.name,
                cpu: process.cpu,
                memory: process.mem,
                user: process.user
            }
        })
        //this sorts the processes based on cpu usage
        childProcesses.sort((a, b) => b.cpu - a.cpu);
        if (childProcesses.length > 0) {
            childData = childProcesses.splice(0, 10)
        }
    } catch (e) {
        console.error(`There was an issue monitoring the child processes:\n ${e.message}`)
    }
}

//make child processes gathered every minute, as there is a lot of data to gather.
;(async () => {
    await getChildProcesses()

    setInterval(() => {
        getChildProcesses().catch(console.error)
    }, 60000)
})().catch(console.error)

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
            available: memoryAvailable.toFixed(2),
            usage: memoryUsed.toFixed(2),
        }
    } catch (e) {
        console.error(`There was an issue monitoring the memory:\n ${e.message}`)
    }
}

async function getCpu () {
    try {
        // processing cpu data initial

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

//constantly updates metrics
const interval = setInterval(async () => {
    try {
        metrics = {
            hostName: os.hostname(),
            deviceData: deviceData,
            memoryUsage: await getMemory(),
            cpuUsage: await getCpu(),
            gpuData: await monitorGraphics(),
            childProcesses: childData,
            interfaces: await getInterfaceData()
        }
        console.log(metrics)
    } catch (e) {
        console.error(`There was an issue gathering interval:\n ${e.message}`)
    }
}, 1000)

function getMetrics () {
    return metrics
}

const port = 3000

app.use(cors(
    {
        origin: "*",
        methods: ["GET", "HEAD", "OPTIONS"]
    }
));

//returns the metrics
app.get('/', (req, res) => {
    // I need to add some form of authentication? maybe
    const metrics = getMetrics();
// checks if metrics is available
    if (!metrics || metrics === {} || metrics === null) res.status(500).send('Metrics Data not available')
    res.status(200).send(metrics)
})

app.listen(port, () => {
    console.log(`[Server] API Listening on port ${port}`)
})