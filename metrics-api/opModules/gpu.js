const fs = require('fs').promises;
const {getDiskSize} = require('./utils');

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

    console.log(`AMD GPU: ${JSON.stringify({
        temp: temp ? `${Math.round(parseInt(temp) / 1000)} degreesCelc` : null,               // millidegrees -> °C
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
    }, null, 2)}`);

    return {
        temp: temp ? `${Math.round(parseInt(temp) / 1000)} ℃` : null,                        // millidegrees -> °C
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

const example =
{
    temp: "49 degreesCelc",
    fanSpeed: "0 RPM",
    powerDraw: "34 W",
    powerCap: "220 W",
    clocks: {
        gfx: "800 MHz",
        mem: "875 MHz"
},
    util: {
        gpu: "0 %",
        mem: {
            percent: "0 %",
            total: "7.98GB",
            used: "2.14GB"
        }
    }
}

module.exports = {getAmdGpuData};