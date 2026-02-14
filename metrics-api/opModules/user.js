const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt')
const {nanoid} = require("nanoid");
const saltRounds = 10
const filePath = path.join(__dirname, '../persistentData/user.json');

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
                return await addUser({username: username, password: response.hash, role, id: nanoid()});
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
        await fs.writeFile(filePath, JSON.stringify(newUsers), 'utf8')
        return {
            success: true,
        }
    } catch (e) {
        console.error('[Server - writeUser] Internal error: ', e)
        return {
            success: false,
        }
    }
}

async function readUsers() {
    try {
        const rawUsers = await fs.readFile(filePath, 'utf8')

        if (!rawUsers.trim()) {
            console.error('[Server - readUsers] Expected array, got:', JSON.stringify(rawUsers));
            return []
        }

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
        const user = users.find((user) => user.username === username)
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


module.exports = {createUser, deleteUser, authenticateUser}