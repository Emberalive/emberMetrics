const express = require('express')
const app = express()
const {getHostIp} = require('./opModules/utils')
// functions for metrics gathering
const {getMetrics, setChildLength} = require('./opModules/metrics')
const {findDevice} = require('./opModules/device')
const cors = require('cors')
const port = 3000

const deviceRoutes = require('./routes/deviceRoutes')
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')

app.use(express.json())
app.use(cors({
    origin: "*",
    methods: ["GET", "HEAD", "OPTIONS", "POST","DELETE", "PATCH"],
}));

app.use('/devices', deviceRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes)

app.post('/', async (req, res) => {
    const {device, childLength} = req.body
    if (!device || !childLength) {
        console.log('[ Server - /getMetrics ] no device or childLength sent')
        return res.status(400).send({success: false})
    }

    const parsed = parseInt(childLength, 10)
    if (typeof parsed === 'number') {
        setChildLength(parsed);
    } else {
        console.log('[ Server - /getMetrics ] childLength is not a number')
        return res.status(400).send({success: false})
    }
    if (device.isHost) {
        //run locally if the device sent is the host device
        const metrics = getMetrics();
        if (metrics || (typeof metrics === 'object' && Object.keys(metrics).length !== 0)) {
            return res.status(200).json({
                metrics: metrics,
                success: true
            }); // always send JSON
        }
    }

    const found = await findDevice(device.id)
    if (!found.success) {
        console.log('[ Server - /getMetrics ] Device does not exist')
        return res.status(404).send({success: false})
    }

    try {
        const response = await fetch(`http://${device.ip}:3000`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                childLength: childLength
            })
        })
        const resData = await response.json()
        if (response.ok) {
            if (resData.success) {
                return res.status(200).send(resData)
            }
        }
        console.log(`[ Server - /getMetrics ] Error from remote device ${resData.reason}`)
        return res.status(500).send({success: false})
    } catch (e) {
        console.log(`[ Server - /getMetrics ] Error gathering metrics: ${e.message}`)
        res.status(500).send({success: false})
    }
})

app.listen(port, async () => {
    console.log(`[Server] API Listening on port ${port}`)
    await getHostIp()
})