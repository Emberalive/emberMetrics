const os = require('os')

let metrics = {
    hostName: os.hostname(),
}
//getting Device information


const deviceData = [
    { label: 'Platform', value: os.platform() },
    { label: 'Name', value: os.type() },
    { label: 'Release', value: os.release() },
    { label: 'Version', value: os.version() },
    { label: 'Architecture', value: os.arch() },
    {label: 'HostName', value: os.hostname() },
];

console.log("Device Data:\n" + JSON.stringify(deviceData));

metrics = (prev => {
    return {
        ...prev,
        deviceData: deviceData
    }
})

// processing cpu data initial
let oldCpus = os.cpus()

//constantly updates cpu and memory data
const interval = setInterval(() => {
    metrics = (prev => {
        return {
            ...prev,
            memoryUsage: (os.freemem() / os.totalmem()) * 100
        }
    })

    const memoryAvailable = (os.freemem() / os.totalmem()) * 100
    const memoryUsed = 100 - memoryAvailable

    console.log("Memory available: " + memoryAvailable + "\nMemory used: " + memoryUsed)

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
            usage: usage.toFixed(2)
            // no: i
        });
    }

    metrics = (prev => {
        return {
            ...prev,
            cpuUsage: cpuUsagePercentage
        }
    })
    oldCpus = newCpus
    console.log("CPU Usage:\n" + JSON.stringify(cpuUsagePercentage))
    let totalCPU = 0
    cpuUsagePercentage.forEach(cpu => {
        totalCPU += parseFloat(cpu.usage)
    })
    console.log("TotalCPU:\n" + totalCPU.toFixed(2))
    // console.log(JSON.stringify(metrics))
}, 1000)
// return () => clearInterval(interval) //stops the process from running if it is unmounted

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