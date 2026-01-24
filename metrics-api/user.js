async function createUser(user) {
    //calls [hashPassword] to hash the users password
    //once the hash has been returned and is successful calls [writeUser]
    //when write user has been completed and is successful returns true through the API route
    //if any function calls don't work return error 500 internal server error
}

async function authenticateUser(user) {
    //function calls [readUser] and returns true if the user exists
    //if user exists checks password hash by calling [checkPassword]
    //if checkPassword succeeds, return true through API route
    //if any function calls don't work return error 500 internal server error
}

async function deleteUser(username, password) {
    //will call [readUser], checks if the user exists
    //if user exists call [removeUser]
    //if returns successful return true through API route
    //if any function calls don't work return error 500 internal server error
}

async function writeUser(user) {
    //this will be used to write  a user to the user json file
}

async function removeUser(username) {
    //deletes a user from the user json file
}

async function readUser(username) {
    //this function will be used to read a user from the user json file
}

async function getDevices(username) {
    //This will be used to get a user based on their username from the json file
}

async function addUser(user) {
    //this function will be used to create a user for the application
}

async function hashPassword (password) {
    //this function will be used to hash a password for when creating a user
}

async function checkPassword(password, hashedPassword) {
    //this function is used to check if the password entered is the correct password compared to the hash
}


module.exports = {createUser, deleteUser, authenticateUser}