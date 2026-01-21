# EmberMetrics API

EmberMetrics provides a lightweight HTTP API for collecting and exposing system metrics from Linux-based devices.  
The system is designed around a **collector–host model**, supporting both remote metric collection and centralized device management.

---

## API Variants Overview

EmberMetrics consists of **two distinct API implementations**, each with a clearly defined responsibility.

---

## 1. Remote Device Metrics API

### Purpose

The Remote Device Metrics API runs on **monitored devices** and exposes real-time system metrics over HTTP.  
It is designed to be lightweight, read-only, and easy to deploy.

This API:

- Exposes live system metrics only
- Does not persist data
- Does not manage devices
- Is intended for remote access by a central host or dashboard

---

### Server Configuration

- Default port: `3000`
- Bind address: default
- CORS: enabled (`*`)
- Authentication: not implemented (planned)

---

### Available Routes

#### `GET /`

Returns the most recent snapshot of system metrics.

##### Response Example

```json
{
  "hostName": "sam-box",
  "deviceData": [
    { "label": "Platform", "value": "linux" },
    { "label": "Name", "value": "Linux" },
    { "label": "Release", "value": "6.8.0-90-generic" },
    { "label": "Architecture", "value": "x64" },
    {
      "label": "Version",
      "value": "#91-Ubuntu SMP PREEMPT_DYNAMIC Tue Nov 18 14:14:30 UTC 2025"
    }
  ],
  "memoryUsage": {
    "available": "74.92",
    "usage": "25.08"
  },
  "cpuUsage": {
    "cores": [
      { "no": 1, "usage": "4.00" }
    ],
    "total": "4.63",
    "temps": {
      "mainTemp": 58.5,
      "maxTemp": null
    }
  },
  "gpuData": [],
  "childProcesses": [],
  "interfaces": [],
  "disks": []
}
```

---

### Metrics Collection Details

- Metrics update interval: **1 second**
- Child process refresh interval: **60 seconds**
- CPU usage calculated using delta sampling
- GPU fields gracefully fall back to `"N/A"` when unsupported

---

## 2. Hosted Device Management API

### Purpose

The Hosted Device Management API runs on the **central EmberMetrics host**.  
It combines system metrics for the host machine with persistent management of remote devices.

This API:

- Exposes local system metrics
- Manages a list of remote devices
- Persists device data to a JSON file
- Acts as the control plane for EmberMetrics

---

### Server Configuration

- Default port: `3000`
- Bind address: `0.0.0.0`
- CORS: enabled
- JSON request bodies supported

---

### Available Routes

#### `GET /`

Returns the hosted device’s system metrics.

- Response format matches the Remote Device Metrics API

---

#### `GET /devices`

Returns all stored devices.

##### Response

```json
{
  "devices": [
    {
      "id": "device-1",
      "name": "Remote Server",
      "ip": "192.168.1.10"
    }
  ],
  "success": true
}

```

---

#### `POST /devices`

Adds a new device to persistent storage.

##### Request Body

```json
{
  "device": {
    "id": "device-2",
    "name": "Office PC",
    "ip": "192.168.1.20"
  }
}
```

##### Response

```json
{
  "success": true
}
```

---

>All the requests below have been implemented but are not currently working, They need to be tested and debugged
#### `PATCH /devices`

Edits an existing device.

##### Request Body

```json
{
  "id": "device-2",
  "name": "Updated Device Name",
  "ip": "192.168.1.25"
}
```

##### Response

```json
{
  "success": true
}
```

---

#### `DELETE /devices`

Deletes a device from storage.

##### Request Body

```json
{
  "device": "device-2"
}
```

##### Response

```json
{
  "success": true
}
```

---

## Metrics Data Model

### Host & OS

- Hostname
- Platform
- OS name
- Kernel release
- Architecture
- OS version

---

### CPU

- Per-core usage percentages
- Total CPU usage
- Temperature data:
    - Main temperature
    - Maximum temperature (if available)

---

### Memory

- Available memory percentage
- Used memory percentage

---
### Processes

- Top 10 processes by CPU usage
- PID
- Name
- CPU usage
- Memory usage
- User

---

### Network Interfaces

- Interface name
- Default interface flag
- MAC address
- Interface type
- IPv4 and IPv6 addresses
- Transmit and receive rates

---

### Storage

- Disk name
- Vendor
- Device path
- Capacity (GB / TB)
- Interface type

---

## Persistence

The Hosted API stores devices in a local JSON file:

`./devices.json`

- Read on startup
- Updated on add, edit, and delete operations
- No external database required

---

## Security Notes

- No authentication currently implemented
- Intended for trusted or internal networks
- Authentication and authorisation are planned

---

## Roadmap

- Authentication for remote devices
- Historical metrics storage
- Role-based access control
- API versioning
- Formal JSON schema validation
- docker composed installation
