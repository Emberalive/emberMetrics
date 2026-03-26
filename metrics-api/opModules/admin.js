const { spawn } = require('child_process');
const {readUsers, writeUser} = require("./user");


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

const managers = {
    apt: {
        install: { cmd: "sudo", args: ["apt", "install", "-y"] },
        remove: { cmd: "sudo", args: ["apt", "remove", "-y"] },
        check: { cmd: "sudo", args: ["dpkg", "-s"] },
        search: { cmd: "sudo", args: ["apt", "search"] }
    },

    dnf: {
        install: { cmd: "sudo", args: ["dnf", "install", "-y"] },
        remove: { cmd: "sudo", args: ["dnf", "remove", "-y"] },
        check: { cmd: "sudo", args: ["rpm", "-q"] },
        search: { cmd: "sudo", args: ["dnf", "search"] }
    },

    yum: {
        install: { cmd: "sudo", args: ["yum", "install", "-y"] },
        remove: { cmd: "sudo", args: ["yum", "remove", "-y"] },
        check: { cmd: "sudo", args: ["rpm", "-q"] },
        search: { cmd: "sudo", args: ["yum", "search"] }
    },

    pacman: {
        install: { cmd: "sudo", args: ["pacman", "-S", "--noconfirm"] },
        remove: { cmd: "sudo", args: ["pacman", "-R", "--noconfirm"] },
        check: { cmd: "sudo", args: ["pacman", "-Qi"] },
        search: { cmd: "sudo", args: ["pacman", "-Ss"] }
    },

    zypper: {
        install: { cmd: "sudo", args: ["zypper", "install", "-y"] },
        remove: { cmd: "sudo", args: ["zypper", "remove", "-y"] },
        check: { cmd: "sudo", args: ["rpm", "-q"] },
        search: { cmd: "sudo", args: ["zypper", "search"] }
    },

    emerge: {
        install: { cmd: "sudo", args: ["emerge", "--quiet"] },
        remove: { cmd: "sudo", args: ["emerge", "--unmerge", "--quiet"] },
        check: { cmd: "sudo", args: ["qlist", "-I"] },
        search: { cmd: "sudo", args: ["emerge", "--search"] }
    },

    flatpak: {
        install: { cmd: "sudo", args: ["flatpak", "install", "-y", "--noninteractive"] },
        remove: { cmd: "sudo", args: ["flatpak", "uninstall", "-y", "--noninteractive"] },
        check: { cmd: "sudo", args: ["flatpak", "info"] },
        search: { cmd: "sudo", args: ["flatpak", "search"] }
    },

    snap: {
        install: { cmd: "sudo", args: ["snap", "install"] },
        remove: { cmd: "sudo", args: ["snap", "remove"] },
        check: { cmd: "sudo", args: ["snap", "list"] },
        search: { cmd: "sudo", args: ["snap", "search"] },
    }
}

function getManager(manager, operation) {
    console.log(`[ Server - getManager ] manager: ${manager}, operation: ${operation }`)

    const managerObj = managers[manager]

    if (!managerObj) {
        console.log(`[ Server - getManager ] unknown package manager: ${manager}`)
        return { success: false }
    }

    const operationCmd = managerObj[operation]

    if (!operationCmd) {
        console.log(`[ Server - getManager ] unsupported operation '${operation}' for ${manager}`)
        return { success: false }
    }

    return operationCmd
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

async function deactivateAccount (user) {
    console.log(`[ Server - /deactivateAccount ] starting operation`)
    if (!user) return {success: false}
    const users = await readUsers()
    const updatedUsers = users.map((u) =>{
        if (u.id === user.id) {
            return {
                ...user,
                active: false,
            }
        }
        return u
    })
    return await writeUser(updatedUsers)
}

module.exports = { addFireWallRule, runSoftwareOperation, deactivateAccount}