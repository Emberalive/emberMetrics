const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const port = 3001

app.use(cors(
    {
        origin: 'http://localhost:5173',
        methods: ['GET', 'HEAD', 'OPTIONS'],
    }
));

app.disable("etag");

app.get("/", (req, res) => {
    const fileName = path.join(__dirname, 'files/remote-device/remote-device.zip');
    console.log("[Server - /] - Sent a remote device to a user");
    res.set({
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=remote-device.zip",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0"
    });
    res.download(fileName);
});

app.listen(port, () => {
    console.log(`[Server] API Listening on port ${port}`)
});