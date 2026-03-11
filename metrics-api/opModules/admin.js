const { spawn } = require('child_process');


function killProcess(process) {
    if (!process) return {success: false}
    if (process.connected) {
        try {
            return process.kill(process.pid)
        } catch (e) {
            console.log(`[ Server - killProcess ] {${process.pid}} kill process failed: ${e.message}`)
        }
    }
    if (process.killed) {
        return {
            success: false,
            dead: true
        }
    }else {
        return {
            success: false,
            dead: false
        }
    }
}

function getManager(manager, operation) {
    if (operation === 'install' || operation === 'remove') {
        console.log(`[ Server - getManager ] running ${operation} pathway`)
        const packageManagers = {
            apt: { cmd: 'sudo', args: ['apt', operation, '-y'] },
            yum: { cmd: 'sudo', args: ['yum', operation, '-y'] },
            dnf: { cmd: 'sudo', args: ['dnf', operation, '-y'] },
            pacman: { cmd: 'sudo', args: ['pacman', operation === 'install' ? '-S' : '-R', '--noconfirm'] },
            zypper: { cmd: 'sudo', args: ['zypper', operation, '-y'] },
            emerge: { cmd: 'sudo', args: operation === "install" ? ["emerge", "--quiet"] : ["emerge", "--unmerge", "--quiet"] },
            flatpak: { cmd: 'sudo', args: ['flatpak', operation === 'installer' ? 'install' : 'uninstall', '-y', '--noninteractive'] }
        }
        return packageManagers[manager]
    }
    if (operation === 'check') {
        // exit code is 0 if installed, and 1 if not installed
        console.log('[ Server - getManager ] running check pathway')

        const checkCommands = {
            apt: { cmd: "sudo", args: ["dpkg", "-s"] },
            dnf: { cmd: "sudo", args: ["rpm", "-q"] },
            yum: { cmd: "sudo", args: ["rpm", "-q"] },
            pacman: { cmd: "sudo", args: ["pacman", "-Qi"] },
            zypper: { cmd: "sudo", args: ["rpm", "-q"] },
            emerge: { cmd: "sudo", args: ["qlist", "-I"] },
            flatpak: { cmd: "sudo", args: ["flatpak", "info"] }
        }
        return checkCommands[manager]
    }
    console.log(`[ Server - getManager ] operation is: ${operation}, expected \'install\', \'remove\', \'check\'`);
    return {success: false}
}

 function runCommand (command, args) {
     console.log('[ Server - runComm ] running the command on the machine')
    if (!command || !args || !Array.isArray(args)) return {success: false}

    return spawn(command, args)
}

function commandHelper (selectedManager, packageName, operation) {
    const manager = getManager(selectedManager, operation)
    if (!manager) return {success: false}

    const args = [...manager.args, packageName]
    console.log(`[ Server - commandHelper - ${operation} ] Running: ${manager.cmd} ${args.join(' ')}`)

    const result = runCommand(manager.cmd, args)
    if (result) {
        return {
            success: true,
            process: result
        }
    }
    return {success: false}
}

function runSoftwareOperation (packageName, selectedManager, operation)  {
    console.log(`[ Server - runSoftwareOperation ] starting operation: ${operation}`)
    if (!packageName || !selectedManager) return {success: false}
    console.log('[ Server - runSoftwareOperation ] calling commandHelper')
    const subProcess = commandHelper(selectedManager, packageName, operation)

    if (subProcess.success) {
        return subProcess
    }
    return {success: false}
}

function needPort (rule) {
    return rule === "allow" || rule === "deny";
}

function addFireWallRule (rule, chosenPort = null) {
    console.log('[ Server - addFireWallRule] starting operation')
    const needAport = needPort(rule)

    if (!rule) return {success: false}
    if (needAport) {
        if (!chosenPort) return {success: false}
    }

    let args
    if (needAport) {
        args = ['ufw', rule, chosenPort]
    } else {
        const ruleParts = rule.split(' ')
        args = ['ufw', ...ruleParts]
    }

    const command = 'sudo'

    console.log(`[ Server - addFireWallRule] Running: ${command} ${args.join(' ')}`)

    const subProcess = spawn(command, args)

    if (subProcess) {
        return { process: subProcess, success: true }
    }
    return {success: false}
}

module.exports = { addFireWallRule, runSoftwareOperation }