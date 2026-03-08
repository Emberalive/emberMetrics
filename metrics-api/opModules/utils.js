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

module.exports = {getHostIp, getThisIp}