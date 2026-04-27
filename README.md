# EmberMetrics

EmberMetrics is a lightweight, self-hosted remote monitoring and management tool for Linux-based devices. It provides real-time visibility into system resources including CPU, memory, GPU, network, disk and running processes, alongside remote administration features including software management and firewall control.

---

## Overview

EmberMetrics follows a three-component distributed architecture:

- **Front-end** — A React-based web application that provides the user interface for monitoring and management.
- **Host API** — A centralised Node.js/Express API that runs on the host device. It handles authentication, user and device management, and proxies all requests from the front-end to the correct downstream device.
- **Remote Device API** — A lightweight Node.js/Express API deployed on each monitored device. It exposes real-time system metrics and supports software and firewall management operations.

All client requests are routed through the Host API, which authenticates and authorises each request before forwarding it downstream.

```
Client -> Host API -> Remote Device API -> Resource
```

---

## Features

- Real-time monitoring of CPU, memory, GPU, network interfaces, disk and child processes
- GPU support for AMD devices via Linux sysfs and NVIDIA devices via node-nvidia-smi
- Session-based authentication with 24-hour session expiry
- Role-based access control with standard user and admin roles
- Multi-device support with tab-based device switching
- Remote software management (install, remove, check, search) across 8 package managers
- Remote firewall rule management via UFW
- Real-time log streaming for software and firewall operations
- Admin user management including device access control and account activation
- Global device registry with recursive deletion
- Responsive UI supporting desktop, tablet and mobile
- Customisable themes, colour schemes and metric text size
- Textual and graphical metric views

---

## Architecture

### Host API

Runs on the central host device. Responsibilities include:

- Session-based authentication and authorisation for all requests
- Proxying authenticated requests to remote device APIs
- Persisting user, device and session data to local JSON files
- Exposing its own system metrics alongside management endpoints

**Data persistence:**
- `users.json` - user accounts and device access lists
- `devices.json` - global device registry
- `sessions.json` - active session records

### Remote Device API

Runs on each monitored device. Responsibilities include:

- Exposing real-time system metrics
- Handling software installation and management commands
- Handling firewall rule management commands

The remote device API has no authentication of its own. All requests are authenticated by the Host API before being forwarded.

---

## API Routes (High Level)

### Authentication
| Method | Route | Description |
| --- | --- | --- |
| POST | `/login` | Create a new session |
| POST | `/logout` | Invalidate the current session |

### Metrics
| Method | Route | Description |
| --- | --- | --- |
| GET | `/` | Returns a real-time snapshot of system metrics |

### Devices
| Method | Route | Description |
| --- | --- | --- |
| GET | `/devices` | Returns all devices in the global registry |
| POST | `/devices` | Adds a new device globally |
| PATCH | `/devices` | Updates an existing device |
| DELETE | `/devices` | Removes a device globally and from all user lists |

### Users
| Method | Route | Description |
| --- | --- | --- |
| GET | `/users` | Returns all users (admin only) |
| PATCH | `/users` | Updates a user account |
| PATCH | `/users/devices` | Adds or removes a device from a user's allowed list |
| PATCH | `/users/activate` | Activates or deactivates a user account (admin only) |

### Software Management
| Method | Route | Description |
| --- | --- | --- |
| POST | `/software` | Performs a software operation (install, remove, check, search) |

### Firewall Management
| Method | Route | Description |
| --- | --- | --- |
| POST | `/firewall` | Applies a firewall rule |

---

## Metrics Data Model

Each metrics snapshot includes:

- **Device data** — hostname, platform, OS name, kernel release, architecture, OS version
- **CPU** — per-core usage percentages, total usage
- **Memory** — used and available percentages
- **GPU** — utilisation, VRAM usage, temperature, fan speed, clock speeds (AMD via sysfs, NVIDIA via node-nvidia-smi)
- **Processes** — top N processes by CPU usage including PID, name, CPU, memory and user
- **Network interfaces** — name, type, MAC, IPv4/IPv6, transmit and receive rates
- **Storage** — disk name, vendor, device path, capacity, interface type

---

## Security

EmberMetrics uses session-based authentication. Sessions are stored server-side and expire after 24 hours. Expired sessions are cleaned up hourly.

All endpoints are protected by authentication middleware. Admin-only endpoints additionally verify the user's role before processing the request.

**Note:** EmberMetrics is intended for use on trusted internal networks. Data is transmitted over HTTP. HTTPS support is planned for a future release.

---

## Roadmap

- Docker-based installation for simplified deployment
- HTTPS support with SSL encryption
- Container monitoring and management
- Historical metrics storage
- Draggable and customisable dashboard layout
- Multiple GPU support
- API versioning

---

## Documentation

Full setup and usage documentation is available at:
[https://ember-metrics.docs.emberalive.com](https://ember-metrics.docs.emberalive.com)

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Front-end | React, Vite, MUI X Charts |
| Host API | Node.js, Express |
| Remote Device API | Node.js, Express |
| GPU (AMD) | Linux sysfs |
| GPU (NVIDIA) | node-nvidia-smi |
| Metrics | Node.js os module, systeminformation |
| Auth | Session-based, JSON persistence |