const express = require('express')
const router = express.Router()
const {checkDeviceStructure } = require('../opModules/utils')
const {findDevice, deleteDevice, addDevice} = require("../opModules/device");
const {writeUser, readUsers, updateUser, createUser} = require("../opModules/user");
const {authenticate} = require("../opModules/sessionMiddleware");
const {deactivateAccount, checkAdmin} = require("../opModules/admin");

router.use(authenticate);
router.use(checkAdmin);

router.post("/createUser", async (req, res) => {
    const {password, email, role, username} = req.body.newUser;
    if (!password || !username || !role) {
        return res.status(400).send({
            success: false,
        });
    }
    const response = await createUser(username, password, role, email);
    if (response.reason) {
        res.status(409).send({success: false});
    } else if (response.success) {
        res.status(200).send(response);
    } else {
        res.status(500).send({success: false});
    }
})

async function deviceAdminHandler (editUser, device, admin, failLog, res) {
    try {
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

    if (!admin || !device || !editUser) return res.status(400).send({success: false})

    const response = await deviceAdminHandler(editUser, device, admin,`[Server - POST /users/removeDevice] Revoke access of ${device.name} from the  user: ${editUser.username} failed`, res)
    if (response.success) {
        console.log(`[ Server - POST /admin/removeDevice ] User: ${editUser.username} has been revoked of access from device: ${device.name}`)
        res.status(200).send({success: true})
    } else {
        res.status(500).send({success: false})
    }
})

router.post('/createDevice', async (req, res) => {
    const {device, admin} = req.body

    if (!admin || !device) return res.status(400).send({success: false})
    const response = await addDevice(device)
    if (response.success) {
        return res.status(200).send({success: true})
    } else {
        if (response.reason) {
            return res.status(400).send(response)
        }
        return res.status(500).send({success: false})
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
    const result = await deactivateAccount(user)
    if (result.success) {
        return res.status(200).send({success: true})
    }
    return res.status(500).send({success: false})
})

router.post('/toggleUserActive' ,async (req, res) => {
    console.log('[ Server - DELETE /admin/deactivateUser ] starting route access')
    const { user, admin } = req.body
    if (!admin || !user) return res.status(400).send({success: false})
    const response = await deactivateAccount(user)
    if (response.success) {
        return res.status(200).send({success: true})
    }
    return res.status(500).send({success: false})
})

module.exports = router