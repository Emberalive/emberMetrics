const express = require('express')
const app = express()
// functions for metrics gathering
const {getMetrics} = require('./opModules/metrics')
const cors = require('cors')
const port = 3000

const deviceRoutes = require('./routes/deviceRoutes')
const userRoutes = require('./routes/userRoutes')


app.use(express.json())
app.use(cors({
    origin: "*",
    methods: ["GET", "HEAD", "OPTIONS", "POST","DELETE"],
}));

app.use('/devices', deviceRoutes);
app.use('/users', userRoutes);

//returns the metrics
app.get('/', (req, res) => {
    const metrics = getMetrics();

    if (!metrics || (typeof metrics === 'object' && Object.keys(metrics).length === 0)) {
        return res.status(500).json({ error: 'Metrics Data not available' });
    }
    res.status(200).json(metrics); // always send JSON
});

app.listen(port, "0.0.0.0", () => {
    console.log(`[Server] API Listening on port ${port}`)
})