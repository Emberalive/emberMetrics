const express = require('express')
const {createUser, deleteUser, authenticateUser} = require('../opModules/user')
const router = express.Router()

router.get('/', async(req, res) => {
    console.log('[Server - GET /users] starting route access')
    const userName = req.user.username
    if (!userName) {
        console.log('[Server - GET /users] No username sent')
        return res.status(400).send({
            error: 'User name is required',
            success: false
        })
    } else {
        const response = await authenticateUser(userName)
        if (!response.success) {
            console.log('[Server - GET /users] authenticateUser failed.]')
            return res.status(404).send({
                error: 'User not found',
                success: false
            })
        } else {
            console.log('[Server - GET /users] authenticateUser succeeded.')
            res.status(200).send(response)
        }
    }
})

router.post('/', async (req, res) => {
    console.log('[Server - POST /users] starting route access')
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).send({
            error: 'Username and password required',
            success: false
        })
    } else {
        try {
            const response = await createUser(username, password)
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

router.delete('/', async (req, res) => {
    console.log('[Server - DELETE /users] starting route access')
    const { username } = req.body.user
    if (!username) {
        console.log('[Server - DELETE /users] no username sent')
        return res.status(400).send({
            success: false,
        })
    } else {
        try {
            const response = await deleteUser(username)
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

module.exports = router