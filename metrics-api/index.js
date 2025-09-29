const express = require('express')
const app = express()

const getMetrics = require('./metrics')
const cors = require('cors')

const port = 3000


app.use(express.json())
app.use(cors(
    {
        //for dev, all for now
        origin: ["https://metrics.emberalive.com", "86.20.86.223:5173"],
        methods: ["GET", "HEAD"]
    }
));

//returns the metrics
app.get('/', (req, res) => {
    // I need to add some form of authentication? maybe
    const metrics = getMetrics()
    // checks if metrics is available
    if (!metrics || metrics === {} || metrics === null) res.status(500).send('Metrics Data not available')
    res.status(200).send(metrics)
})

app.listen(port, () => {
    console.log(`[Server] API Listening on port ${port}`)
})