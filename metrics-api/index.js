const express = require('express')
const app = express()

const {getDevices, addDevice, deleteDevice, getMetrics} = require('./metrics')
const cors = require('cors')
const port = 3000


app.use(express.json())
app.use(cors({
    origin: "*",
    methods: ["GET", "HEAD", "OPTIONS", "POST","DELETE"],
}));

//returns the metrics
app.get('/', (req, res) => {
    const metrics = getMetrics();

    if (!metrics || (typeof metrics === 'object' && Object.keys(metrics).length === 0)) {
        return res.status(500).json({ error: 'Metrics Data not available' });
    }

    res.status(200).json(metrics); // always send JSON
});

app.get('/devices', async (req, res) => {
    const devices = await getDevices()
    if (!devices) {
        res.status(500).json('Devices Data not available')
    } else {
        res.status(200).json(devices)
    }
})

app.post('/devices', async (req, res) => {
    const response = await addDevice(req.body.device)
    if (response.success) {
        res.status(200).send(response)
    } else {
        res.status(500).json({
            success: false,
        })
    }
})

app.delete('/devices', async (req, res) => {
    const deviceId = req.body.device
    if (!deviceId) {
        res.status(400).send({
            success: false,
        })
    } else {
        const response = await deleteDevice(deviceId)
        if (response.success) {
            res.status(200).json(response)
        } else {
            res.status(500).json({
                success: false,
            })
        }
    }
})

app.listen(port, "0.0.0.0", () => {
    console.log(`[Server] API Listening on port ${port}`)
})