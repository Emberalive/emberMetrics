const express = require('express')
const router = express.Router()
const {exec} = util.promisify(require('child_process'));

//run a command on the machine
router.post("/", (req, res) => {

})