const express = require('express')
const {createUser, deleteUser, authenticateUser, updateUser, readUsers, writeUser} = require('../opModules/user')
const {checkDeviceStructure} = require("../opModules/utils");
const {findDevice} = require("../opModules/device");
const router = express.Router()

router.get('/', async (req, res) => {
    console.log("[ Server - GET /users ] Getting all users for an admin")
    const users = await readUsers()
    if (Array.isArray(users)) {
        return res.status(200).json({
            users: users,
            success: true
        })
    }
    return res.status(404).json({ success: false })
})

//login the user in
router.post('/login', async(req, res) => {
    console.log('[Server - POST /users - login] starting route access')
    const {username, password} = req.body.user
    if (!username || !password) {
        console.log('[Server - POST /users - login] No username sent')
        return res.status(400).send({
            error: 'User name and password is required',
            success: false
        })
    } else {
        const response = await authenticateUser(req.body.user)
        if (!response.success) {
            console.log('[Server - POST /users - login] authenticateUser failed.]')
            return res.status(404).send({
                error: 'User not found',
                success: false
            })
        } else {
            console.log('[Server - POST /users - login] authenticateUser succeeded.')
            res.status(200).send(response)
        }
    }
})

//registering a new user
router.post('/', async (req, res) => {
    console.log('[Server - POST /users] starting route access')
    const { username, password , confirmPassword, role} = req.body.user
    console.log(`[Server - POST /users] ${JSON.stringify(req.body.user)}    `)
    if (!username || !password) {
        if (password !== confirmPassword) {
            console.log('[Server - POST /users] authenticateUser failed - password and confirmPassword do not match')
            return res.status(400).send({
                success: false
            })
        }
        return res.status(400).send({
            error: 'Username and password required',
            success: false
        })
    } else {
        try {
            const response = await createUser(username, password, role)
            if (!response.success) {
                console.log('[Server - POST /users] create user failed.')
                return res.status(400).send({
                    success: false,
                })
            } else {
                console.log('[Server - POST /users] create user succeeded.')
                res.status(200).send(response)
            }
        } catch (e) {
            console.log('[Server - POST /users] internal error:', e)
            return res.status(500).send({
                success: false,
            })
        }
    }
})

//update user details
router.patch('/', async (req, res) => {
    console.log('[Server - PATCH /users] starting route access')
    const { username, newUser } = req.body
    if (!username || !newUser) {
        console.log('[Server - PATCH /users] edit user failed, no username or new data provided')
        return res.status(400).send({
            success: false
        })
    } else {
        const response = await updateUser(username, newUser)
        if (response.success) {
            const reason = response.reason
            switch (reason) {
                case 'user_notFound':
                    console.log('[Server - PATCH /users] update user failed.')
                    return res.status(404).send({
                        success: false
                    })
                case 'username_taken':
                    console.log('[Server - PATCH /users] update user failed.')
                    return res.status(409).send({
                        success: false
                    })
                case 'user_updated_failed':
                    console.log('[Server - PATCH /users] update user failed - internal error.')
                    return res.status(500).send({
                        success: false
                    })
            }
        }
        if (response.success) {
            console.log('[Server - PATCH /users] update user succeeded.')
            return res.status(200).send(response)
        } else {
            console.log('[Server - PATCH /users] update user failed.')
            return res.status(500).send({
                success: false
            })
        }
    }

})

router.delete('/', async (req, res) => {
    console.log('[Server - DELETE /users] starting route access')
    const user = req.body.user
    if (!user) {
        console.log('[Server - DELETE /users] no username sent')
        return res.status(400).send({
            success: false,
        })
    } else {
        try {
            const response = await deleteUser(user)
            if (!response.success) {
                console.log('[Server - DELETE /users] delete user failed.')
                return res.status(500).send({
                    success: false,
                })
            } else {
                console.log('[Server - DELETE /users] delete succeeded.')
                res.status(200).send(response)
            }
        } catch (e) {
            console.log('[Server - DELETE /users] delete failed.')
            return res.status(500).send({
                success: false,
            })
        }
    }
})


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
    console.log('[ Server - DELETE /users/removeDevice ] starting route access')
    const {editUser, device, admin} = req.body

    const response = await deviceAdminHandler(editUser, device, admin,`[Server - POST /users/removeDevice] Revoke access of ${device.name} from the  user: ${editUser.username} failed`, res)
    if (response.success) {
        console.log(`[ Server - POST /users/removeDevice ] User: ${editUser.username} has been revoked of access from device: ${device.name}`)
        res.status(200).send({success: true})
    } else {
        res.status(500).send({success: false})
    }
})

router.post('/addDevice', async (req, res) => {
    console.log('[ Server - DELETE /users/addDevice ] starting route access')
    const {editUser, device, admin} = req.body

    const response = await deviceAdminHandler(editUser, device, admin,`[ Server - POST /users/addDevice ] Failed to give access of device: ${device.name} for user: ${editUser.username}`, res)
    if (response.success) {
        console.log(`[ Server - POST /users/addDevice ] Added ${device.name} to ${editUser.username}'s allowed devices`)
        res.status(200).send({success: true})
    } else {
        res.status(500).send({success: false})
    }
})

module.exports = router