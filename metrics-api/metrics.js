const os = require('os')
const si = require('systeminformation')


let metrics = {}
//getting Device information

module.exports = metrics

async function monitorGraphics() {
    try {
        //when actually implementing it, if there is no data to access (integrated graphics, set a tertiary check so
        // that i can set it as N/A instead of undefined)
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
    metrics = (prev => {
        return {
            ...prev,
            memoryUsage: ((os.freemem() / os.totalmem()) * 100)
        }
    })

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
    }

    const gpu = await monitorGraphics()
    console.log(JSON.stringify(gpu, null, 2))
}, 1000)

function getMetrics () {
    return metrics
}

module.exports = getMetrics


//for one loop of the module:

// {
//     "deviceData": [
//     { "label": "Platform", "value": "linux" },
//     { "label": "Name", "value": "Linux" },
//     { "label": "Release", "value": "6.8.0-65-generic" },
//     { "label": "Version", "value": "#68~22.04.1-Ubuntu SMP PREEMPT_DYNAMIC Tue Jul 15 18:06:34 UTC 2" },
//     { "label": "Architecture", "value": "x64" },
//     { "label": "HostName", "value": "sam-box" }
// ],
//     "memory": {
//     "availablePercent": 72.73848358039923,
//         "usedPercent": 27.261516419600767
// },
//     "cpuUsage": [
//     { "usage": "3.96" },
//     { "usage": "2.00" },
//     { "usage": "24.59" },
//     { "usage": "2.00" },
//     { "usage": "1.98" },
//     { "usage": "6.06" },
//     { "usage": "2.00" },
//     { "usage": "3.00" },
//     { "usage": "5.88" },
//     { "usage": "3.96" },
//     { "usage": "12.75" },
//     { "usage": "2.97" },
//     { "usage": "2.97" },
//     { "usage": "1.00" },
//     { "usage": "0.00" },
//     { "usage": "0.00" }
// ]
// }