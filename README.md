# EmberMetrics

EmberMetrics is a lightweight Node.js–based system metrics collector and management platform (with an expanding full application) designed to gather, manage, and present detailed system information from one or more devices.

The project is structured around **structured JSON output**, enabling real-time dashboards, remote monitoring, and configurable user interfaces.

---

## Features

### Host & Operating System
- Hostname identification.
- Platform and OS metadata:
  - Platform
  - OS name
  - Kernel release
  - Architecture
  - Full OS version string

---

### CPU Metrics
- Per-core CPU usage percentages.
- Total CPU usage percentage.
- CPU temperature data:
  - Current (main) temperature
  - Maximum temperature (if available)

---

### Memory Metrics
- Memory usage as percentages:
  - Used
  - Available

---

### GPU Metrics
- GPU model detection.
- GPU utilization metrics (where supported):
  - Core utilization
  - Memory usage
  - Temperature
  - Power draw
  - Core and memory clocks
- Graceful handling of unsupported or unavailable fields (`"N/A"`).

---

### Process Monitoring
- Active process list - top 10 CPU usage processes including:
  - PID
  - Process name
  - CPU usage
  - Memory usage
  - Owning user
- Designed to highlight resource-intensive applications.

---

### Network Interfaces
- Enumeration of network interfaces.
- Interface metadata:
  - Name
  - MAC address
  - Interface type (e.g. wireless, virtual)
  - Default interface flag
- IPv4 and IPv6 addresses.
- Transmitted and received data counters.

---

### Storage Devices
- Disk and drive enumeration.
- Device metadata:
  - Name
  - Vendor
  - Type (e.g. NVMe)
  - Device path
  - Capacity
  - Interface type (e.g. PCIe)

---

## Application Features

### Device Management
- Register and manage multiple monitored devices.
- Designed for both local and remote monitoring scenarios.

---

### Metrics Visualization
- Structured data ready for dashboards and charts.
- Designed for real-time and historical views.
- Clear separation between data collection and presentation layers.

---

### Theme Management
- Switch between application themes (e.g. light and dark).
- Centralised theme configuration, different pre defined colour themes.

---

### Font Size & Accessibility Controls
- Adjustable global font size.
- Improves readability across different screen sizes.
- Accessibility-focused UI design considerations.

---

### Fullscreen Mode
- Toggle fullscreen mode for dashboards and focused monitoring views.
- Intended for wall displays, monitoring stations, and kiosks.

---

## Installation

Ensure you have **Node.js** installed.

Clone the repository:

```bash
git clone <repository-url>
cd embermetrics
```

Run the front end locally:

```bash
cd emberMetrics
npm install
npm run dev
```

Run the API locally:

```bash
(from project root)
cd metrics-api
npm install
npm run dev
```

This installation allows for local usage viewing only, to host the web app and the API for remote access you need to host the app on a web server:

```bash
npm run build
```

- This will create a `dist` directory with static assets
- These assets can be directly moved to your web server

setting up the api is the same way as local hosting, except you need to manage the API routes through your web server such as:

```bash
server {
    server_name metrics-api.emberalive.com;
    #This name is for my example host which can be accessed to have a look at what teh app will look like

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
	}

      # Node API endpoint
    location /devices {
        proxy_pass http://127.0.0.1:3000/devices;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
***This is an nginx example***


## Roadmap

- Persistent historical metrics storage.
- Alerting and threshold-based notifications.
- Cross-platform compatibility improvements.
- graph metrics view
- docker composed installation
