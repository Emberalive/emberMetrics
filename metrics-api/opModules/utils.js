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

module.exports = {getHostIp, getThisIp, getDiskSize}