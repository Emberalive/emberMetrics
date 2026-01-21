const os = require('os')
const si = require('systeminformation')
const fs = require('fs').promises;
const filePath = './devices.json'

let metrics = {}
let childData = []
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

async function getDiskInfo () {
    try {
        const disks = await si.diskLayout()
        const diskList = disks.map((disk) => {
            return {
                name: disk.name,
                type: disk.type,
                vendor: disk.vendor,
                device: disk.device,
                size: (disk.size / (1024 ** 3)).toFixed(2).toString().length > 6 ? (disk.size / (1024 ** 4)).toFixed(2).toString() + 'TB': (disk.size / (1024 ** 3)).toFixed(2).toString() + 'GB',
                interfaceType: disk.interfaceType,
            }
        })

        const diskUsage = await si.disksIO()

        const stats = await si.fsStats();
        console.log(stats);

        return {
            totalDiskUsage: {
                rIO: diskUsage.rIO,
                wIO: diskUsage.wIO,
                rIO_sec: diskUsage.rIO_sec.toFixed(2),
                wIO_sec: diskUsage.wIO_sec.toFixed(2),
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
            childProcesses: childData,
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

async function readDevices () {
    const rawDevices = await fs.readFile(filePath, 'utf8')
    return JSON.parse(rawDevices)
}

async function writeDevices (newDevices) {
    try {
        await fs.writeFile(filePath, JSON.stringify(newDevices), 'utf8')
        return {
            success: true,
        }
    } catch (e) {
        console.error("Error writing to devices: ", e);
        return {
            success: false,
        }
    }
}

async function getDevices () {
    try {
        const devices = await readDevices()
        console.log("[Server - GET | devices] devices to send: " + JSON.stringify(devices))
        return {
            devices: devices,
            success: true
        }
    } catch (e) {
        console.error('Error reading devices:', e)
    }
}

async function addDevice (device) {
    try {
        console.log(`[Server - POST | devices] addDevice: ${device} ]`)
        let deviceData = await readDevices()

        deviceData.push(device)
        console.log(`[Server - POST | devices] updatedDevices: ${JSON.stringify(deviceData)}`)
        return await writeDevices(deviceData)
    } catch (e) {
        console.error('Error adding device:', e)
    }
}

async function deleteDevice (device) {
    const devices = await readDevices()
    const index = devices.indexOf(device)

    if (index === -1) {
        return {
            success: false,
        }
    }
    devices.splice(index, 1)
    return await writeDevices(devices)
}

async function editDevice (device) {
    const devices = await readDevices()
    const editedDevices = devices.map( oldDevice => {
        if (oldDevice.id === device.id) {
            return {
                ...oldDevice, name: device.name, ip: device.ip
        }
        }
        return oldDevice
    })
    return await writeDevices(editedDevices)
}

module.exports = {getMetrics, getDevices, addDevice, deleteDevice, editDevice};


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