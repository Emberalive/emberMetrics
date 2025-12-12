const os = require('os')
const si = require('systeminformation')
const express = require('express')
const app = express()

const cors = require('cors')

let metrics = {}
//getting Device information

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

const deviceData = [
    { label: 'Platform', value: os.platform() },
    { label: 'Name', value: os.type() },
    { label: 'Release', value: os.release() },
    { label: 'Version', value: os.version() },
    { label: 'Architecture', value: os.arch() },
];


// processing cpu data initial
let oldCpus = os.cpus()

//constantly updates cpu and memory data
const interval = setInterval(async () => {

    const memoryAvailable = (os.freemem() / os.totalmem()) * 100
    const memoryUsed = 100 - memoryAvailable

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
        const usage = ((total - deltaIdle) / total) * 100;

        cpuUsagePercentage.push({
            usage: usage.toFixed(2),
            no: i + 1
        });
    }

    oldCpus = newCpus
    let totalCPU = cpuUsagePercentage.reduce(
        (sum, cpu) => sum + parseInt(cpu.usage), 0) / cpuUsagePercentage.length
    const gpus = await monitorGraphics() || ['no data']
    metrics = {
        hostName: os.hostname(),
        deviceData: deviceData,
        memoryUsage: {
            usage: memoryUsed.toFixed(2),
            available: memoryAvailable.toFixed(2)
        },
        cpuUsage: {
            cores: cpuUsagePercentage,
            total: totalCPU
        },
        gpuData: gpus
    }
}, 1000)

function getMetrics() {
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