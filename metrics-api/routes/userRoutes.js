const express = require('express')
const {createUser, deleteUser, authenticateUser, updateUser, readUsers, writeUser} = require('../opModules/user')
const {checkDeviceStructure} = require("../opModules/utils");
const {findDevice} = require("../opModules/device");
const {createSession} = require("../opModules/sessionUtils");
const { authenticate } = require("../opModules/sessionMiddleware");
const bcrypt = require('bcrypt')

const router = express.Router()



//login the user in
router.post('/login', async(req, res) => {
    console.log('[Server - POST /users - login] starting route access')
    const {username, password} = req.body.user
    if (!username || !password) {
        console.log('[Server - POST /users - login] No username sent')
        return res.status(400).send({error: 'User name and password is required', success: false})
    }
    const response = await authenticateUser(req.body.user)
    if (!response.success) {
        console.log('[Server - POST /users - login] authenticateUser failed.]')
        return res.status(401).send({error: 'User not found', success: false})
    }

    if (!response.user.active) {
        console.log('[Server - POST /users - login] Account has been suspended.')
        return res.status(403).send({ error: 'Account suspended', success: false });
    }

    const sessionId = await createSession(response.user.id);
    return res.status(200).send({ success: true, sessionId, user: response.user });
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
    }
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
})

router.use(authenticate);

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

router.patch('/password', authenticate, async (req, res) => {
    console.log('[Server - PATCH /users/password] starting route access')
    const { username, currentPassword, newPassword } = req.body;
    if (!username || !currentPassword || !newPassword) {
        console.log('[Server - PATCH /users] incorrect parameters sent')
        return res.status(400).send({success:false})
    }
    const users = await readUsers();
    const user = users.find(u => u.username === username);
    if (!user) {
        console.log('[Server - PATCH /users/password] user not found')
        return res.status(404).json({success: false});
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
        console.log('[Server - PATCH /users/password] passwords did not match')
        return res.status(401).json({success: false, message: 'Incorrect password'});
    }
    user.password = await bcrypt.hash(newPassword, 10);
    const response = await writeUser(users);
    if (response.success) {
        console.log('[Server - PATCH /users/password] users password updated successfully')
        res.status(200).send({ success: true });
    } else {
        console.log('[Server - PATCH /users/password] passwords was not updated')
        res.status(500).send({ success: false });
    }
});

module.exports = router