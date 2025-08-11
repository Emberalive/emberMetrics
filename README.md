# EmberMetrics

EmberMetrics is a lightweight Node.js script (and soon a full app) to monitor and display your device’s system metrics, including CPU usage, memory usage, and device information.

---

## Features

- Displays device information such as platform, OS name, release, version, architecture, and hostname.
- Continuously monitors CPU usage per core and calculates total CPU load.
- Shows memory usage as available and used percentages.
- Updates metrics every second.

---

## Installation

Make sure you have [Node.js](https://nodejs.org/) installed.

Clone the repository or copy the script.

---

## Usage

Run the script with Node.js:

```bash
node metrics.js
```

```bash
Device Data:
[
  { "label": "Platform", "value": "linux" },
  { "label": "Name", "value": "Linux" },
  { "label": "Release", "value": "6.8.0-65-generic" },
  { "label": "Version", "value": "#68~22.04.1-Ubuntu SMP PREEMPT_DYNAMIC Tue Jul 15 18:06:34 UTC 2" },
  { "label": "Architecture", "value": "x64" },
  { "label": "HostName", "value": "sam-box" }
]

Memory available: 72.74%
Memory used: 27.26%

CPU Usage:
[
  { "usage": "3.96" },
  { "usage": "2.00" },
  { "usage": "24.59" },
  { "usage": "2.00" },
  { "usage": "1.98" },
  { "usage": "6.06" },
  { "usage": "2.00" },
  { "usage": "3.00" },
  { "usage": "5.88" },
  { "usage": "3.96" },
  { "usage": "12.75" },
  { "usage": "2.97" },
  { "usage": "2.97" },
  { "usage": "1.00" },
  { "usage": "0.00" },
  { "usage": "0.00" }
]

Total CPU Usage: 27.39%

```