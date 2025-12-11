const express = require('express')
const app = express()

const {getDevices, addDevice, deleteDevice, getMetrics} = require('./metrics')
const cors = require('cors')
const port = 3000


app.use(express.json())
app.use(cors({
    origin: "*",
    methods: ["GET", "HEAD"],
}));

//returns the metrics
app.get('/', (req, res) => {
    // I need to add some form of authentication? maybe
    const metrics = getMetrics()
    // checks if metrics is available
    if (!metrics || metrics === {} || metrics === null) res.status(500).send('Metrics Data not available')
    res.status(200).send(metrics)
})

app.get('/devices', (req, res) => {
    const devices = getDevices()
    if (!devices) {
        res.status(500).send('Devices Data not available')
    } else {
        res.status(200).send(devices)
    }
})

app.post('/devices', (req, res) => {
    const response = addDevice(req.body.device)
    if (response.success) {
        res.status(200).send(response)
    } else {
        res.status(500).send({
            success: false,
        })
    }
})

app.delete('/devices/', (req, res) => {
    const deviceId = req.params.device
    if (!deviceId) {
        res.status(400).send({
            success: false,
        })
    } else {
        const response = deleteDevice(deviceId)
        if (response.success) {
            res.status(200).send(response)
        } else {
            res.status(500).send({
                success: false,
            })
        }
    }
})

app.listen(port, "0.0.0.0", () => {
    console.log(`[Server] API Listening on port ${port}`)
})