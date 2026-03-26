const express = require('express')
const router = express.Router()
const {checkDeviceStructure } = require('../opModules/utils')
const {findDevice, deleteDevice} = require("../opModules/device");
const {writeUser, readUsers, deleteUser, updateUser} = require("../opModules/user");
const {authenticate} = require("../opModules/sessionMiddleware");
const {deactivateAccount} = require("../opModules/admin");

router.use(authenticate);

async function deviceAdminHandler (editUser, device, admin, failLog, res) {
    try {
        if (admin.role !== 'admin') return res.status(500).send({success: false})

        if (!editUser || !admin) return res.status(400).send({success: false})
        if (!checkDeviceStructure(device)) res.status(400).send({success: false})

        const found = await findDevice(device.id)
        if (!found) return res.status(404).send({success: false})

        const userList = await readUsers()
        const updatedUsers = userList.map((u) => {
            if (u.id === editUser.id) {
                return editUser
            }
            return u
        })
        return await writeUser(updatedUsers)
    } catch (e) {
        console.log(`${failLog}\nERROR: ${JSON.stringify(e)}`)
    }
}


router.post('/removeDevice', async (req, res) => {
    console.log('[ Server - DELETE /admin/removeDevice ] starting route access')
    const {editUser, device, admin} = req.body

    const response = await deviceAdminHandler(editUser, device, admin,`[Server - POST /users/removeDevice] Revoke access of ${device.name} from the  user: ${editUser.username} failed`, res)
    if (response.success) {
        console.log(`[ Server - POST /admin/removeDevice ] User: ${editUser.username} has been revoked of access from device: ${device.name}`)
        res.status(200).send({success: true})
    } else {
        res.status(500).send({success: false})
    }
})

router.post('/addDevice', async (req, res) => {
    console.log('[ Server - DELETE /admin/addDevice ] starting route access')
    const {editUser, device, admin} = req.body

    const response = await deviceAdminHandler(editUser, device, admin,`[ Server - POST /users/addDevice ] Failed to give access of device: ${device.name} for user: ${editUser.username}`, res)
    if (response.success) {
        console.log(`[ Server - POST /admin/addDevice ] Added ${device.name} to ${editUser.username}'s allowed devices`)
        res.status(200).send({success: true})
    } else {
        res.status(500).send({success: false})
    }
})

router.delete('/globalDevice', async (req, res) => {
    console.log('[ Server - DELETE /admin/removeDevice ] starting route access')
    const {device, admin} = req.body
    if (admin.role !== 'admin') return res.status(401).send({success: false})
    if (!device) return res.status(400).send({success: false})
    if (!checkDeviceStructure(device)) res.status(400).send({success: false})

    console.log('[ Server - DELETE /admin/removeDevice ] Removed device from the user\'s that hold it')
    const deleted = await deleteDevice(device.id)
    if (deleted.success) {
        const users = await readUsers()
        for (const u of users) {
            if (u.devices.some((d) => d.id === device.id)) {
                const newUserDevices = u.devices.filter((d) => d.id !== device.id)
                await updateUser(u.username, {...u, devices: newUserDevices})
            }
        }
    }
    return res.status(200).send({ success: true })
})


router.delete('/user', async (req, res) => {
    console.log('[Server - DELETE /admin/user ] starting route access')
    const { user, admin} = req.body
    if (!user || admin) {
        console.log('[Server - DELETE /admin/user ] no username sent')
        return res.status(400).send({success: false})
    }
    if (admin.role !== 'admin') return res.status(401).send({success: false})

    const result = await deactivateAccount(user)
    if (result.success) {
        return res.status(200).send({success: true})
    }
    return res.status(500).send({success: false})
})

module.exports = router