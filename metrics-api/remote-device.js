const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const port = 3001

app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'HEAD', 'OPTIONS'],
    }
));

app.get("/", (req, res) => {
    const fileName = path.join(__dirname, 'files/remote-device/remote-device.zip');

    res.download(fileName, 'remote-device.zip');
});

app.listen(port, () => {
    console.log(`[Server] API Listening on port ${port}`)
});