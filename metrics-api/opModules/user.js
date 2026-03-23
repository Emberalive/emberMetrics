const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt')
const {nanoid} = require("nanoid");
const saltRounds = 10
const storedFilePath = path.join(__dirname, `../persistentData/user.json`);
const tmpfilePath = storedFilePath + ".tmp"


async function checkDevicePerm (userID, deviceID) {
    console.log("[ Server - /users/checkDevicePerms ] checking device permissions");
    if (!userID) return false
    const userData = (await getUser(userID))
    if (!userData.success || !userData.user.active) return false
    const userDevices = userData.user.devices
    console.log(`[ Server - /users/checkDevicePerm ] current allowed devices: ${JSON.stringify(userDevices, null, 2)}`);
    const allowed = userDevices.findIndex(device => device.id === deviceID)
    console.log("[ Server - /users/checkDevicePerm ] is the device allowed?: ", allowed !== -1)
    return allowed !== -1;
}

async function createUser(username, password, role) {
    try {
        const currentUsers = await readUsers()
        console.log('[Server - createUser] Current Users', currentUsers)
        const exist = await currentUsers.find(e => e.username === username)
        if (!password || !username) {
            console.error('[Server - createUser] Password and username required!');
            return {
                success: false,
            }
        }
        if (exist) {
            return {
                success: false,
                reason: 'User already exists!'
            }
        } else {
            const response = await hashPassword(password, saltRounds);
            if (response.success) {
                console.log('[Server - createUser] Successfully created!]')
                return await addUser({username: username, password: response.hash, role, id: nanoid(), devices: [{"name":"localhost","ip":"127.0.0.1","id":"DgxI77r32HDNeBfh0sK8B"}]});
            } else {
                console.error('[Server - createUser] Error hashing password')
                return {
                    success: false,
                }
            }
        }
    } catch (e) {
        console.error('[Server - createUser] Internal error: ', e.message);
        return {
            success: false
        }
    }
}

async function updateUser(username, newUser) {
    try {
        let userData = newUser
        const currentUsers = await readUsers()
        const exists = currentUsers.find(e => e.username === username)
        if (!exists) {
            console.log('[Server - updateUser] User doesnt exist | cant update details')
            return {
                success: false,
                reason: 'user_notFound'
            }
        }
        console.log('[Server - updateUser] User found successfully!');
        //checking for username collision
        const usernameTaken = currentUsers.some(u => u.username === userData.username && u.username !== username)
        if (usernameTaken) {
            console.log('[Server - updateUser] Username already exists!')
            return { success: false, reason: 'username_taken' }
        }
        const updatedUsers = currentUsers.map( (user) => {
            if (user.username === username) {
                return {
                    ...userData,
                    password: user.password
                }
            }
            return user
        })
        const written = await writeUser(updatedUsers)
        if (written.success) {
            console.log('[Server - updateUser] Successfully updated!')
            return {
                success: true,
                updatedUser: userData,
                reason: 'user_updated_successfully'
            }
        }
    } catch (e) {
        console.log('[Server - updateUser] Error updating user\n', e.message);
        return {
            success: false,
            reason: 'user_updated_failed'
        }
    }
}

async function authenticateUser(user) {
    try {
        const userData = await getUser(user.username);
        if (!userData) {
            return  {
                success: false,
            }
        } else {
            return {
                success : await checkPassword(user.password, userData.user.password),
                user: userData.user
            }
        }
    } catch (e) {
        console.error(`[Server - authenticateUser] Error validating: ${user.username}`, e.message);
        return {
            success: false,
        }
    }
}

async function deleteUser(user) {
    try {
        const users = await readUsers();
        const index = users.indexOf(user);

        if (index > -1) {
            users.splice(index, 1);
            return await writeUser(users);
        } else {
            return {
                success: false,
            }
        }
    } catch (e) {
        console.error('[Server - removeUser] Internal error: ', e)
        return {
            success: false,
        }
    }
}

async function writeUser(newUsers) {
    try {
        await fs.writeFile(tmpfilePath, JSON.stringify(newUsers, null, 2), 'utf8')

        await fs.rename(tmpfilePath, storedFilePath)
        console.log('[Server - writeUser] Successfully updated user list')
        return {success: true}
    } catch (e) {
        console.error('[Server - writeUser] Internal error: ', e)
        return {
            success: false,
        }
    }
}

async function readUsers() {
    try {
        const rawUsers = await fs.readFile(storedFilePath, 'utf8')

        if (!rawUsers.trim()) {
            console.error('[Server - readUsers] Expected array, got:', JSON.stringify(rawUsers));
            return []
        }
        console.log('[ Server - readUsers] Retrieved user list')

        return JSON.parse(rawUsers);
    } catch (e) {
        console.error('[Server - readUsers] Internal error: ', e)
        return {
            success: false,
        }
    }
}

async function getUser(username) {
    try {
        const users = await readUsers()
        let user = users.find((user) => user.username === username)
        if (!user) {
            user = users.find((user) => user.id === username)
        }
        console.log('[Server - getUser] user found: ', user)
        return {
            success: true,
            user: user,
        }
    } catch (e) {
        console.error('[Server - getUsers] Internal error: ', e)
        return {
            success: false,
        }
    }
}

async function addUser(user) {
    try {
        console.log('[Server - addUser] New user: ', user)
        let userData = await readUsers()
        console.log('[Server - addUser] previous users: ', JSON.stringify(userData))
        userData.push(user)

        if (userData.find(e => e.username === user.username)) {
            console.log('[Server - addUser] new user has been added successfully!')
            console.log('[Server - addUser] updated users: ', JSON.stringify(userData));
            return {
                success: await writeUser(userData),
                user: userData
            }
        }
        return {
            success: false,
        }

    } catch (e) {
        console.error('[Server - addUser] Internal error: ', e)
        return {
            success: false,
        }
    }
}

async function hashPassword (password, saltRounds) {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        if (hashedPassword) {
            return {
                hash: hashedPassword,
                success: true,
            };
        } else {
            console.log('[Server - hashPassword | devices] password not hashed')
            return  {
                success: false,
            }
        }
    } catch (e) {
        console.log('[Server - DELETE | devices] internal error:', e)
        return {
            success: false,
        }
    }
}

async function checkPassword(password, hashedPassword) {
    if (!hashedPassword || !password) {
        console.log('[Server - CHECK PASSWORD] incorrect parameter')
        return {
            success: false,
        }
    }
    try {
        if (await bcrypt.compare(password, hashedPassword)) {
            console.log('[Server - CHECK PASSWORD] Password is correct')
            return {
                success: true,
            }
        } else {
            console.log('[Server - CHECK PASSWORD] Password is not correct')
            return {
                success: false,
            }
        }

    } catch (e) {
        console.log('[Server - CHECK PASSWORD] internal error:', e)
        return {
            success: false,
        }
    }
}


module.exports = {createUser, deleteUser, authenticateUser, updateUser, readUsers, writeUser, checkDevicePerm}