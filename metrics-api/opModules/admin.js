const { spawn } = require('child_process');


function killProcess(process) {
    if (!process) return {success: false}
    if (process.connected) {
        try {
            return process.kill(process.pid)
        } catch (e) {
            console.log(`[ Server - killProcess] {${process.pid}} kill process failed: ${e.message}`)
        }
    }
    return {
        success: false,
        dead: true
    }
}

 function runCommand (command, args) {
     console.log('[Server - runComm] running a command on the machine')
    if (!command || !args || !Array.isArray(args)) return {success: false}

    return spawn(command, args)
}

function runSoftwareInstall (packageName, selectedManager, device)  {
    console.log('[Server - runSoftwareInstall] starting operation')
    if (!packageName || !selectedManager || !device) return {success: false}


    const packageManagers = {
        apt: { cmd: 'sudo', args: ['apt', 'install', '-y'] },
        yum: { cmd: 'sudo', args: ['yum', 'install', '-y'] },
        dnf: { cmd: 'sudo', args: ['dnf', 'install', '-y'] },
        pacman: { cmd: 'sudo', args: ['pacman', '-S', '--noconfirm'] },
        zypper: { cmd: 'sudo', args: ['zypper', 'install', '-y'] },
        emerge: { cmd: 'sudo', args: ['emerge', '--quiet'] },
        flatpak: { cmd: 'sudo', args: ['flatpak', 'install', '-y', '--noninteractive'] }
    }

    const manager = packageManagers[selectedManager]
    if (!manager) return {success: false}

    const args = [...manager.args, packageName]
    console.log(`[Server - runSoftwareInstall] Running: ${manager.cmd} ${args.join(' ')}`)

    const subProcess = runCommand(manager.cmd, args)

    if (subProcess) {
        return { process: subProcess, success: true }
    }
    return {success: false}
}

module.exports = { runSoftwareInstall }