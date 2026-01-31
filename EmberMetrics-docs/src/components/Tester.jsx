import {createRef, useEffect, useState} from "react";
import '../tester.css'
import Header from "./testerComponents/Header.jsx";
import DeviceData from "./testerComponents/DeviceData.jsx";
import CpuData from "./testerComponents/CpuData.jsx";
import MemoryData from "./testerComponents/MemoryData.jsx";
import ChildProcesses from "./testerComponents/ChildProcesses.jsx";
import NetworkData from "./testerComponents/NetworkData.jsx";
import DiskData from "./testerComponents/DiskData.jsx";
import CollapseWhite from "../assets/collapse-white.svg";
import CollapseBlack from "../assets/collapse-black.svg";
import ExpandWhite from "../assets/expand-white.svg";
import ExpandBlack from "../assets/expand-black.svg";
import Sparkr from "../assets/SVG 2.1 | Original Sparkr.svg";

export default function Tester() {

    const metricArray = [
        {
            "hostName": "sam-box",
            "deviceData": [
                {"label": "Platform", "value": "linux"},
                {"label": "Name", "value": "Linux"},
                {"label": "Release", "value": "6.8.0-90-generic"},
                {"label": "Architecture", "value": "x64"},
                {"label": "Version", "value": "#91-Ubuntu SMP PREEMPT_DYNAMIC Tue Nov 18 14:14:30 UTC 2025"}
            ],
            "memoryUsage": {
                "available": "71.24",
                "usage": "28.76"
            },
            "cpuUsage": {
                "cores": [
                    {"usage": "6.52", "no": 1},
                    {"usage": "5.10", "no": 2},
                    {"usage": "4.08", "no": 3},
                    {"usage": "4.12", "no": 4},
                    {"usage": "2.02", "no": 5},
                    {"usage": "7.07", "no": 6},
                    {"usage": "2.02", "no": 7},
                    {"usage": "4.04", "no": 8},
                    {"usage": "4.08", "no": 9},
                    {"usage": "2.02", "no": 10},
                    {"usage": "7.00", "no": 11},
                    {"usage": "0.00", "no": 12},
                    {"usage": "7.29", "no": 13},
                    {"usage": "4.26", "no": 14},
                    {"usage": "7.07", "no": 15},
                    {"usage": "3.13", "no": 16}
                ],
                "total": "4.25",
                "temps": {"mainTemp": 56.3, "maxTemp": null}
            },
            "gpuData": [
                {
                    "model": "Navi 10 [Radeon RX 5600 OEM/5600 XT / 5700/5700 XT]",
                    "memory": {
                        "used": "N/A",
                        "total": "N/A",
                        "free": "N/A",
                        "utilization": "N/A"
                    },
                    "utilization": "N/A",
                    "temp": "N/A",
                    "power": "N/A",
                    "clocks": {"core": "N/A", "memory": "N/A"}
                }
            ],
            "childProcesses": [
                {"pid": 33354, "name": "node", "cpu": 2.2126992422262868, "memory": 0.3, "user": "sammy"},
                {"pid": 10377, "name": "webstorm", "cpu": 0.9239613274105043, "memory": 11.3, "user": "sammy"},
                {"pid": 3337, "name": "Xwayland", "cpu": 0.459890253462242, "memory": 0.5, "user": "sammy"},
                {"pid": 2805, "name": "gnome-shell", "cpu": 0.34178207473216615, "memory": 1.5, "user": "sammy"},
                {"pid": 11363, "name": "", "cpu": 0.2978834596289522, "memory": 3.4, "user": "sammy"},
                {"pid": 1510, "name": "NetworkManager", "cpu": 0.10138489678599424, "memory": 0, "user": "root"},
                {"pid": 11739, "name": "firefox", "cpu": 0.10033969166448915, "memory": 1.1, "user": "sammy"},
                {"pid": 1316, "name": "@dbus-daemon", "cpu": 0.09511366605696367, "memory": 0, "user": "messagebus"},
                {"pid": 12102, "name": "firefox", "cpu": 0.07316435850535669, "memory": 0.7, "user": "sammy"},
                {"pid": 12069, "name": "firefox", "cpu": 0.030310948523647765, "memory": 1.7, "user": "sammy"}
            ],
            "interfaces": [
                {
                    "name": "wlp4s0",
                    "default": true,
                    "mac": "4c:49:6c:4a:9d:68",
                    "type": "wireless",
                    "addresses": {"ip4": "192.168.0.67", "ip6": "fd73:759f:fb95:c124:d903:898c:decc:d62d"},
                    "data": {"transmitted": "85.91", "received": "403.60"}
                },
                {
                    "name": "lo",
                    "default": false,
                    "mac": "00:00:00:00:00:00",
                    "type": "virtual",
                    "addresses": {"ip4": "127.0.0.1", "ip6": "::1"},
                    "data": {"transmitted": "3574.00", "received": "3574.00"}
                }
            ],
            "disks": {
                "totalDiskUsage": {
                    "rIO": 171708,
                    "wIO": 205376,
                    "rIO_sec": "0.00",
                    "wIO_sec": "2.01",
                    "rx_sec": 0,
                    "wx_sec": 8216.649949849549
                },
                "disks": [
                    {
                        "name": "Samsung SSD 970 EVO Plus 2TB",
                        "type": "NVMe",
                        "vendor": "Samsung",
                        "device": "/dev/nvme0n1",
                        "size": "1.82TB",
                        "interfaceType": "PCIe"
                    },
                    {
                        "name": "KINGSTON SNV2S500G",
                        "type": "NVMe",
                        "vendor": "Kingston Technology",
                        "device": "/dev/nvme1n1",
                        "size": "465.76GB",
                        "interfaceType": "PCIe"
                    }
                ]
            }
        },
        {
            "hostName": "sam-box",
            "deviceData": [
                {"label": "Platform", "value": "linux"},
                {"label": "Name", "value": "Linux"},
                {"label": "Release", "value": "6.8.0-90-generic"},
                {"label": "Architecture", "value": "x64"},
                {"label": "Version", "value": "#91-Ubuntu SMP PREEMPT_DYNAMIC Tue Nov 18 14:14:30 UTC 2025"}
            ],
            "memoryUsage": {
                "available": "70.85",
                "usage": "29.15"
            },
            "cpuUsage": {
                "cores": [
                    {"usage": "7.15", "no": 1},
                    {"usage": "5.65", "no": 2},
                    {"usage": "4.52", "no": 3},
                    {"usage": "4.45", "no": 4},
                    {"usage": "2.35", "no": 5},
                    {"usage": "7.85", "no": 6},
                    {"usage": "2.25", "no": 7},
                    {"usage": "4.35", "no": 8},
                    {"usage": "4.45", "no": 9},
                    {"usage": "2.35", "no": 10},
                    {"usage": "7.45", "no": 11},
                    {"usage": "0.15", "no": 12},
                    {"usage": "7.85", "no": 13},
                    {"usage": "4.65", "no": 14},
                    {"usage": "7.65", "no": 15},
                    {"usage": "3.45", "no": 16}
                ],
                "total": "4.45",
                "temps": {"mainTemp": 56.8, "maxTemp": null}
            },
            "gpuData": [
                {
                    "model": "Navi 10 [Radeon RX 5600 OEM/5600 XT / 5700/5700 XT]",
                    "memory": {
                        "used": "N/A",
                        "total": "N/A",
                        "free": "N/A",
                        "utilization": "N/A"
                    },
                    "utilization": "N/A",
                    "temp": "N/A",
                    "power": "N/A",
                    "clocks": {"core": "N/A", "memory": "N/A"}
                }
            ],
            "childProcesses": [
                {"pid": 33354, "name": "node", "cpu": 2.4156992422262868, "memory": 0.4, "user": "sammy"},
                {"pid": 10377, "name": "webstorm", "cpu": 1.0239613274105043, "memory": 11.4, "user": "sammy"},
                {"pid": 3337, "name": "Xwayland", "cpu": 0.489890253462242, "memory": 0.6, "user": "sammy"},
                {"pid": 2805, "name": "gnome-shell", "cpu": 0.38178207473216615, "memory": 1.6, "user": "sammy"},
                {"pid": 11363, "name": "", "cpu": 0.3278834596289522, "memory": 3.5, "user": "sammy"},
                {"pid": 1510, "name": "NetworkManager", "cpu": 0.12138489678599424, "memory": 0.1, "user": "root"},
                {"pid": 11739, "name": "firefox", "cpu": 0.12033969166448915, "memory": 1.2, "user": "sammy"},
                {"pid": 1316, "name": "@dbus-daemon", "cpu": 0.10511366605696367, "memory": 0.1, "user": "messagebus"},
                {"pid": 12102, "name": "firefox", "cpu": 0.08316435850535669, "memory": 0.8, "user": "sammy"},
                {"pid": 12069, "name": "firefox", "cpu": 0.040310948523647765, "memory": 1.8, "user": "sammy"}
            ],
            "interfaces": [
                {
                    "name": "wlp4s0",
                    "default": true,
                    "mac": "4c:49:6c:4a:9d:68",
                    "type": "wireless",
                    "addresses": {"ip4": "192.168.0.67", "ip6": "fd73:759f:fb95:c124:d903:898c:decc:d62d"},
                    "data": {"transmitted": "86.25", "received": "405.15"}
                },
                {
                    "name": "lo",
                    "default": false,
                    "mac": "00:00:00:00:00:00",
                    "type": "virtual",
                    "addresses": {"ip4": "127.0.0.1", "ip6": "::1"},
                    "data": {"transmitted": "3578.45", "received": "3578.45"}
                }
            ],
            "disks": {
                "totalDiskUsage": {
                    "rIO": 172125,
                    "wIO": 206215,
                    "rIO_sec": "0.05",
                    "wIO_sec": "2.15",
                    "rx_sec": 2,
                    "wx_sec": 8235.849949849549
                },
                "disks": [
                    {
                        "name": "Samsung SSD 970 EVO Plus 2TB",
                        "type": "NVMe",
                        "vendor": "Samsung",
                        "device": "/dev/nvme0n1",
                        "size": "1.82TB",
                        "interfaceType": "PCIe"
                    },
                    {
                        "name": "KINGSTON SNV2S500G",
                        "type": "NVMe",
                        "vendor": "Kingston Technology",
                        "device": "/dev/nvme1n1",
                        "size": "465.76GB",
                        "interfaceType": "PCIe"
                    }
                ]
            }
        },
        {
            "hostName": "sam-box",
            "deviceData": [
                {"label": "Platform", "value": "linux"},
                {"label": "Name", "value": "Linux"},
                {"label": "Release", "value": "6.8.0-90-generic"},
                {"label": "Architecture", "value": "x64"},
                {"label": "Version", "value": "#91-Ubuntu SMP PREEMPT_DYNAMIC Tue Nov 18 14:14:30 UTC 2025"}
            ],
            "memoryUsage": {
                "available": "70.25",
                "usage": "29.75"
            },
            "cpuUsage": {
                "cores": [
                    {"usage": "8.95", "no": 1},
                    {"usage": "7.25", "no": 2},
                    {"usage": "6.18", "no": 3},
                    {"usage": "6.35", "no": 4},
                    {"usage": "3.95", "no": 5},
                    {"usage": "9.85", "no": 6},
                    {"usage": "3.85", "no": 7},
                    {"usage": "6.15", "no": 8},
                    {"usage": "6.25", "no": 9},
                    {"usage": "3.95", "no": 10},
                    {"usage": "9.45", "no": 11},
                    {"usage": "1.85", "no": 12},
                    {"usage": "9.65", "no": 13},
                    {"usage": "6.35", "no": 14},
                    {"usage": "9.45", "no": 15},
                    {"usage": "5.15", "no": 16}
                ],
                "total": "6.25",
                "temps": {"mainTemp": 58.2, "maxTemp": null}
            },
            "gpuData": [
                {
                    "model": "Navi 10 [Radeon RX 5600 OEM/5600 XT / 5700/5700 XT]",
                    "memory": {
                        "used": "N/A",
                        "total": "N/A",
                        "free": "N/A",
                        "utilization": "N/A"
                    },
                    "utilization": "N/A",
                    "temp": "N/A",
                    "power": "N/A",
                    "clocks": {"core": "N/A", "memory": "N/A"}
                }
            ],
            "childProcesses": [
                {"pid": 33354, "name": "node", "cpu": 3.2156992422262868, "memory": 0.5, "user": "sammy"},
                {"pid": 10377, "name": "webstorm", "cpu": 1.2239613274105043, "memory": 11.5, "user": "sammy"},
                {"pid": 3337, "name": "Xwayland", "cpu": 0.529890253462242, "memory": 0.7, "user": "sammy"},
                {"pid": 2805, "name": "gnome-shell", "cpu": 0.42178207473216615, "memory": 1.7, "user": "sammy"},
                {"pid": 11363, "name": "", "cpu": 0.3578834596289522, "memory": 3.6, "user": "sammy"},
                {"pid": 1510, "name": "NetworkManager", "cpu": 0.14138489678599424, "memory": 0.2, "user": "root"},
                {"pid": 11739, "name": "firefox", "cpu": 0.14033969166448915, "memory": 1.3, "user": "sammy"},
                {"pid": 1316, "name": "@dbus-daemon", "cpu": 0.11511366605696367, "memory": 0.2, "user": "messagebus"},
                {"pid": 12102, "name": "firefox", "cpu": 0.09316435850535669, "memory": 0.9, "user": "sammy"},
                {"pid": 12069, "name": "firefox", "cpu": 0.050310948523647765, "memory": 1.9, "user": "sammy"}
            ],
            "interfaces": [
                {
                    "name": "wlp4s0",
                    "default": true,
                    "mac": "4c:49:6c:4a:9d:68",
                    "type": "wireless",
                    "addresses": {"ip4": "192.168.0.67", "ip6": "fd73:759f:fb95:c124:d903:898c:decc:d62d"},
                    "data": {"transmitted": "87.15", "received": "408.95"}
                },
                {
                    "name": "lo",
                    "default": false,
                    "mac": "00:00:00:00:00:00",
                    "type": "virtual",
                    "addresses": {"ip4": "127.0.0.1", "ip6": "::1"},
                    "data": {"transmitted": "3585.75", "received": "3585.75"}
                }
            ],
            "disks": {
                "totalDiskUsage": {
                    "rIO": 172845,
                    "wIO": 207345,
                    "rIO_sec": "0.08",
                    "wIO_sec": "2.35",
                    "rx_sec": 4,
                    "wx_sec": 8265.349949849549
                },
                "disks": [
                    {
                        "name": "Samsung SSD 970 EVO Plus 2TB",
                        "type": "NVMe",
                        "vendor": "Samsung",
                        "device": "/dev/nvme0n1",
                        "size": "1.82TB",
                        "interfaceType": "PCIe"
                    },
                    {
                        "name": "KINGSTON SNV2S500G",
                        "type": "NVMe",
                        "vendor": "Kingston Technology",
                        "device": "/dev/nvme1n1",
                        "size": "465.76GB",
                        "interfaceType": "PCIe"
                    }
                ]
            }
        },
        {
            "hostName": "sam-box",
            "deviceData": [
                {"label": "Platform", "value": "linux"},
                {"label": "Name", "value": "Linux"},
                {"label": "Release", "value": "6.8.0-90-generic"},
                {"label": "Architecture", "value": "x64"},
                {"label": "Version", "value": "#91-Ubuntu SMP PREEMPT_DYNAMIC Tue Nov 18 14:14:30 UTC 2025"}
            ],
            "memoryUsage": {
                "available": "69.85",
                "usage": "30.15"
            },
            "cpuUsage": {
                "cores": [
                    {"usage": "6.85", "no": 1},
                    {"usage": "5.45", "no": 2},
                    {"usage": "4.65", "no": 3},
                    {"usage": "4.75", "no": 4},
                    {"usage": "2.65", "no": 5},
                    {"usage": "8.15", "no": 6},
                    {"usage": "2.65", "no": 7},
                    {"usage": "4.85", "no": 8},
                    {"usage": "4.95", "no": 9},
                    {"usage": "2.65", "no": 10},
                    {"usage": "8.05", "no": 11},
                    {"usage": "0.65", "no": 12},
                    {"usage": "8.35", "no": 13},
                    {"usage": "5.05", "no": 14},
                    {"usage": "8.15", "no": 15},
                    {"usage": "3.95", "no": 16}
                ],
                "total": "5.05",
                "temps": {"mainTemp": 57.5, "maxTemp": null}
            },
            "gpuData": [
                {
                    "model": "Navi 10 [Radeon RX 5600 OEM/5600 XT / 5700/5700 XT]",
                    "memory": {
                        "used": "N/A",
                        "total": "N/A",
                        "free": "N/A",
                        "utilization": "N/A"
                    },
                    "utilization": "N/A",
                    "temp": "N/A",
                    "power": "N/A",
                    "clocks": {"core": "N/A", "memory": "N/A"}
                }
            ],
            "childProcesses": [
                {"pid": 33354, "name": "node", "cpu": 2.8156992422262868, "memory": 0.6, "user": "sammy"},
                {"pid": 10377, "name": "webstorm", "cpu": 1.1239613274105043, "memory": 11.6, "user": "sammy"},
                {"pid": 3337, "name": "Xwayland", "cpu": 0.509890253462242, "memory": 0.8, "user": "sammy"},
                {"pid": 2805, "name": "gnome-shell", "cpu": 0.40178207473216615, "memory": 1.8, "user": "sammy"},
                {"pid": 11363, "name": "", "cpu": 0.3478834596289522, "memory": 3.7, "user": "sammy"},
                {"pid": 1510, "name": "NetworkManager", "cpu": 0.13138489678599424, "memory": 0.3, "user": "root"},
                {"pid": 11739, "name": "firefox", "cpu": 0.13033969166448915, "memory": 1.4, "user": "sammy"},
                {"pid": 1316, "name": "@dbus-daemon", "cpu": 0.11011366605696367, "memory": 0.3, "user": "messagebus"},
                {"pid": 12102, "name": "firefox", "cpu": 0.08816435850535669, "memory": 1.0, "user": "sammy"},
                {"pid": 12069, "name": "firefox", "cpu": 0.045310948523647765, "memory": 2.0, "user": "sammy"}
            ],
            "interfaces": [
                {
                    "name": "wlp4s0",
                    "default": true,
                    "mac": "4c:49:6c:4a:9d:68",
                    "type": "wireless",
                    "addresses": {"ip4": "192.168.0.67", "ip6": "fd73:759f:fb95:c124:d903:898c:decc:d62d"},
                    "data": {"transmitted": "88.45", "received": "412.35"}
                },
                {
                    "name": "lo",
                    "default": false,
                    "mac": "00:00:00:00:00:00",
                    "type": "virtual",
                    "addresses": {"ip4": "127.0.0.1", "ip6": "::1"},
                    "data": {"transmitted": "3592.25", "received": "3592.25"}
                }
            ],
            "disks": {
                "totalDiskUsage": {
                    "rIO": 173565,
                    "wIO": 208475,
                    "rIO_sec": "0.12",
                    "wIO_sec": "2.45",
                    "rx_sec": 6,
                    "wx_sec": 8294.849949849549
                },
                "disks": [
                    {
                        "name": "Samsung SSD 970 EVO Plus 2TB",
                        "type": "NVMe",
                        "vendor": "Samsung",
                        "device": "/dev/nvme0n1",
                        "size": "1.82TB",
                        "interfaceType": "PCIe"
                    },
                    {
                        "name": "KINGSTON SNV2S500G",
                        "type": "NVMe",
                        "vendor": "Kingston Technology",
                        "device": "/dev/nvme1n1",
                        "size": "465.76GB",
                        "interfaceType": "PCIe"
                    }
                ]
            }
        },
        {
            "hostName": "sam-box",
            "deviceData": [
                {"label": "Platform", "value": "linux"},
                {"label": "Name", "value": "Linux"},
                {"label": "Release", "value": "6.8.0-90-generic"},
                {"label": "Architecture", "value": "x64"},
                {"label": "Version", "value": "#91-Ubuntu SMP PREEMPT_DYNAMIC Tue Nov 18 14:14:30 UTC 2025"}
            ],
            "memoryUsage": {
                "available": "69.35",
                "usage": "30.65"
            },
            "cpuUsage": {
                "cores": [
                    {"usage": "12.45", "no": 1},
                    {"usage": "15.25", "no": 2},
                    {"usage": "9.85", "no": 3},
                    {"usage": "10.15", "no": 4},
                    {"usage": "5.95", "no": 5},
                    {"usage": "18.75", "no": 6},
                    {"usage": "5.85", "no": 7},
                    {"usage": "9.95", "no": 8},
                    {"usage": "10.05", "no": 9},
                    {"usage": "5.95", "no": 10},
                    {"usage": "17.85", "no": 11},
                    {"usage": "3.75", "no": 12},
                    {"usage": "18.45", "no": 13},
                    {"usage": "10.25", "no": 14},
                    {"usage": "17.95", "no": 15},
                    {"usage": "8.05", "no": 16}
                ],
                "total": "10.85",
                "temps": {"mainTemp": 61.8, "maxTemp": null}
            },
            "gpuData": [
                {
                    "model": "Navi 10 [Radeon RX 5600 OEM/5600 XT / 5700/5700 XT]",
                    "memory": {
                        "used": "N/A",
                        "total": "N/A",
                        "free": "N/A",
                        "utilization": "N/A"
                    },
                    "utilization": "N/A",
                    "temp": "N/A",
                    "power": "N/A",
                    "clocks": {"core": "N/A", "memory": "N/A"}
                }
            ],
            "childProcesses": [
                {"pid": 33354, "name": "node", "cpu": 5.2156992422262868, "memory": 0.7, "user": "sammy"},
                {"pid": 10377, "name": "webstorm", "cpu": 2.3239613274105043, "memory": 11.7, "user": "sammy"},
                {"pid": 3337, "name": "Xwayland", "cpu": 0.689890253462242, "memory": 0.9, "user": "sammy"},
                {"pid": 2805, "name": "gnome-shell", "cpu": 0.57178207473216615, "memory": 1.9, "user": "sammy"},
                {"pid": 11363, "name": "", "cpu": 0.4978834596289522, "memory": 3.8, "user": "sammy"},
                {"pid": 1510, "name": "NetworkManager", "cpu": 0.19138489678599424, "memory": 0.4, "user": "root"},
                {"pid": 11739, "name": "firefox", "cpu": 0.19033969166448915, "memory": 1.5, "user": "sammy"},
                {"pid": 1316, "name": "@dbus-daemon", "cpu": 0.16511366605696367, "memory": 0.4, "user": "messagebus"},
                {"pid": 12102, "name": "firefox", "cpu": 0.14316435850535669, "memory": 1.1, "user": "sammy"},
                {"pid": 12069, "name": "firefox", "cpu": 0.090310948523647765, "memory": 2.1, "user": "sammy"}
            ],
            "interfaces": [
                {
                    "name": "wlp4s0",
                    "default": true,
                    "mac": "4c:49:6c:4a:9d:68",
                    "type": "wireless",
                    "addresses": {"ip4": "192.168.0.67", "ip6": "fd73:759f:fb95:c124:d903:898c:decc:d62d"},
                    "data": {"transmitted": "90.15", "received": "418.95"}
                },
                {
                    "name": "lo",
                    "default": false,
                    "mac": "00:00:00:00:00:00",
                    "type": "virtual",
                    "addresses": {"ip4": "127.0.0.1", "ip6": "::1"},
                    "data": {"transmitted": "3605.75", "received": "3605.75"}
                }
            ],
            "disks": {
                "totalDiskUsage": {
                    "rIO": 174885,
                    "wIO": 210095,
                    "rIO_sec": "0.18",
                    "wIO_sec": "2.75",
                    "rx_sec": 9,
                    "wx_sec": 8344.349949849549
                },
                "disks": [
                    {
                        "name": "Samsung SSD 970 EVO Plus 2TB",
                        "type": "NVMe",
                        "vendor": "Samsung",
                        "device": "/dev/nvme0n1",
                        "size": "1.82TB",
                        "interfaceType": "PCIe"
                    },
                    {
                        "name": "KINGSTON SNV2S500G",
                        "type": "NVMe",
                        "vendor": "Kingston Technology",
                        "device": "/dev/nvme1n1",
                        "size": "465.76GB",
                        "interfaceType": "PCIe"
                    }
                ]
            }
        },
        {
            "hostName": "sam-box",
            "deviceData": [
                {"label": "Platform", "value": "linux"},
                {"label": "Name", "value": "Linux"},
                {"label": "Release", "value": "6.8.0-90-generic"},
                {"label": "Architecture", "value": "x64"},
                {"label": "Version", "value": "#91-Ubuntu SMP PREEMPT_DYNAMIC Tue Nov 18 14:14:30 UTC 2025"}
            ],
            "memoryUsage": {
                "available": "68.95",
                "usage": "31.05"
            },
            "cpuUsage": {
                "cores": [
                    {"usage": "8.15", "no": 1},
                    {"usage": "6.85", "no": 2},
                    {"usage": "5.95", "no": 3},
                    {"usage": "6.05", "no": 4},
                    {"usage": "3.45", "no": 5},
                    {"usage": "9.65", "no": 6},
                    {"usage": "3.35", "no": 7},
                    {"usage": "5.95", "no": 8},
                    {"usage": "6.05", "no": 9},
                    {"usage": "3.45", "no": 10},
                    {"usage": "9.25", "no": 11},
                    {"usage": "1.35", "no": 12},
                    {"usage": "9.55", "no": 13},
                    {"usage": "6.15", "no": 14},
                    {"usage": "9.45", "no": 15},
                    {"usage": "4.85", "no": 16}
                ],
                "total": "6.15",
                "temps": {"mainTemp": 59.2, "maxTemp": null}
            },
            "gpuData": [
                {
                    "model": "Navi 10 [Radeon RX 5600 OEM/5600 XT / 5700/5700 XT]",
                    "memory": {
                        "used": "N/A",
                        "total": "N/A",
                        "free": "N/A",
                        "utilization": "N/A"
                    },
                    "utilization": "N/A",
                    "temp": "N/A",
                    "power": "N/A",
                    "clocks": {"core": "N/A", "memory": "N/A"}
                }
            ],
            "childProcesses": [
                {"pid": 33354, "name": "node", "cpu": 3.6156992422262868, "memory": 0.8, "user": "sammy"},
                {"pid": 10377, "name": "webstorm", "cpu": 1.5239613274105043, "memory": 11.8, "user": "sammy"},
                {"pid": 3337, "name": "Xwayland", "cpu": 0.589890253462242, "memory": 1.0, "user": "sammy"},
                {"pid": 2805, "name": "gnome-shell", "cpu": 0.48178207473216615, "memory": 2.0, "user": "sammy"},
                {"pid": 11363, "name": "", "cpu": 0.4178834596289522, "memory": 3.9, "user": "sammy"},
                {"pid": 1510, "name": "NetworkManager", "cpu": 0.15138489678599424, "memory": 0.5, "user": "root"},
                {"pid": 11739, "name": "firefox", "cpu": 0.15033969166448915, "memory": 1.6, "user": "sammy"},
                {"pid": 1316, "name": "@dbus-daemon", "cpu": 0.12511366605696367, "memory": 0.5, "user": "messagebus"},
                {"pid": 12102, "name": "firefox", "cpu": 0.10316435850535669, "memory": 1.2, "user": "sammy"},
                {"pid": 12069, "name": "firefox", "cpu": 0.060310948523647765, "memory": 2.2, "user": "sammy"}
            ],
            "interfaces": [
                {
                    "name": "wlp4s0",
                    "default": true,
                    "mac": "4c:49:6c:4a:9d:68",
                    "type": "wireless",
                    "addresses": {"ip4": "192.168.0.67", "ip6": "fd73:759f:fb95:c124:d903:898c:decc:d62d"},
                    "data": {"transmitted": "91.85", "received": "425.55"}
                },
                {
                    "name": "lo",
                    "default": false,
                    "mac": "00:00:00:00:00:00",
                    "type": "virtual",
                    "addresses": {"ip4": "127.0.0.1", "ip6": "::1"},
                    "data": {"transmitted": "3619.25", "received": "3619.25"}
                }
            ],
            "disks": {
                "totalDiskUsage": {
                    "rIO": 176205,
                    "wIO": 211715,
                    "rIO_sec": "0.22",
                    "wIO_sec": "3.05",
                    "rx_sec": 11,
                    "wx_sec": 8393.849949849549
                },
                "disks": [
                    {
                        "name": "Samsung SSD 970 EVO Plus 2TB",
                        "type": "NVMe",
                        "vendor": "Samsung",
                        "device": "/dev/nvme0n1",
                        "size": "1.82TB",
                        "interfaceType": "PCIe"
                    },
                    {
                        "name": "KINGSTON SNV2S500G",
                        "type": "NVMe",
                        "vendor": "Kingston Technology",
                        "device": "/dev/nvme1n1",
                        "size": "465.76GB",
                        "interfaceType": "PCIe"
                    }
                ]
            }
        },
        {
            "hostName": "sam-box",
            "deviceData": [
                {"label": "Platform", "value": "linux"},
                {"label": "Name", "value": "Linux"},
                {"label": "Release", "value": "6.8.0-90-generic"},
                {"label": "Architecture", "value": "x64"},
                {"label": "Version", "value": "#91-Ubuntu SMP PREEMPT_DYNAMIC Tue Nov 18 14:14:30 UTC 2025"}
            ],
            "memoryUsage": {
                "available": "68.45",
                "usage": "31.55"
            },
            "cpuUsage": {
                "cores": [
                    {"usage": "7.45", "no": 1},
                    {"usage": "6.15", "no": 2},
                    {"usage": "5.25", "no": 3},
                    {"usage": "5.35", "no": 4},
                    {"usage": "2.95", "no": 5},
                    {"usage": "8.75", "no": 6},
                    {"usage": "2.85", "no": 7},
                    {"usage": "5.25", "no": 8},
                    {"usage": "5.35", "no": 9},
                    {"usage": "2.95", "no": 10},
                    {"usage": "8.45", "no": 11},
                    {"usage": "0.85", "no": 12},
                    {"usage": "8.75", "no": 13},
                    {"usage": "5.45", "no": 14},
                    {"usage": "8.65", "no": 15},
                    {"usage": "4.25", "no": 16}
                ],
                "total": "5.45",
                "temps": {"mainTemp": 58.5, "maxTemp": null}
            },
            "gpuData": [
                {
                    "model": "Navi 10 [Radeon RX 5600 OEM/5600 XT / 5700/5700 XT]",
                    "memory": {
                        "used": "N/A",
                        "total": "N/A",
                        "free": "N/A",
                        "utilization": "N/A"
                    },
                    "utilization": "N/A",
                    "temp": "N/A",
                    "power": "N/A",
                    "clocks": {"core": "N/A", "memory": "N/A"}
                }
            ],
            "childProcesses": [
                {"pid": 33354, "name": "node", "cpu": 3.1156992422262868, "memory": 0.9, "user": "sammy"},
                {"pid": 10377, "name": "webstorm", "cpu": 1.3239613274105043, "memory": 11.9, "user": "sammy"},
                {"pid": 3337, "name": "Xwayland", "cpu": 0.549890253462242, "memory": 1.1, "user": "sammy"},
                {"pid": 2805, "name": "gnome-shell", "cpu": 0.44178207473216615, "memory": 2.1, "user": "sammy"},
                {"pid": 11363, "name": "", "cpu": 0.3778834596289522, "memory": 4.0, "user": "sammy"},
                {"pid": 1510, "name": "NetworkManager", "cpu": 0.14138489678599424, "memory": 0.6, "user": "root"},
                {"pid": 11739, "name": "firefox", "cpu": 0.14033969166448915, "memory": 1.7, "user": "sammy"},
                {"pid": 1316, "name": "@dbus-daemon", "cpu": 0.12011366605696367, "memory": 0.6, "user": "messagebus"},
                {"pid": 12102, "name": "firefox", "cpu": 0.09816435850535669, "memory": 1.3, "user": "sammy"},
                {"pid": 12069, "name": "firefox", "cpu": 0.055310948523647765, "memory": 2.3, "user": "sammy"}
            ],
            "interfaces": [
                {
                    "name": "wlp4s0",
                    "default": true,
                    "mac": "4c:49:6c:4a:9d:68",
                    "type": "wireless",
                    "addresses": {"ip4": "192.168.0.67", "ip6": "fd73:759f:fb95:c124:d903:898c:decc:d62d"},
                    "data": {"transmitted": "93.55", "received": "432.15"}
                },
                {
                    "name": "lo",
                    "default": false,
                    "mac": "00:00:00:00:00:00",
                    "type": "virtual",
                    "addresses": {"ip4": "127.0.0.1", "ip6": "::1"},
                    "data": {"transmitted": "3632.75", "received": "3632.75"}
                }
            ],
            "disks": {
                "totalDiskUsage": {
                    "rIO": 177525,
                    "wIO": 213335,
                    "rIO_sec": "0.25",
                    "wIO_sec": "3.25",
                    "rx_sec": 13,
                    "wx_sec": 8443.349949849549
                },
                "disks": [
                    {
                        "name": "Samsung SSD 970 EVO Plus 2TB",
                        "type": "NVMe",
                        "vendor": "Samsung",
                        "device": "/dev/nvme0n1",
                        "size": "1.82TB",
                        "interfaceType": "PCIe"
                    },
                    {
                        "name": "KINGSTON SNV2S500G",
                        "type": "NVMe",
                        "vendor": "Kingston Technology",
                        "device": "/dev/nvme1n1",
                        "size": "465.76GB",
                        "interfaceType": "PCIe"
                    }
                ]
            }
        },
        {
            "hostName": "sam-box",
            "deviceData": [
                {"label": "Platform", "value": "linux"},
                {"label": "Name", "value": "Linux"},
                {"label": "Release", "value": "6.8.0-90-generic"},
                {"label": "Architecture", "value": "x64"},
                {"label": "Version", "value": "#91-Ubuntu SMP PREEMPT_DYNAMIC Tue Nov 18 14:14:30 UTC 2025"}
            ],
            "memoryUsage": {
                "available": "67.95",
                "usage": "32.05"
            },
            "cpuUsage": {
                "cores": [
                    {"usage": "22.85", "no": 1},
                    {"usage": "25.45", "no": 2},
                    {"usage": "19.15", "no": 3},
                    {"usage": "19.85", "no": 4},
                    {"usage": "15.25", "no": 5},
                    {"usage": "28.75", "no": 6},
                    {"usage": "15.15", "no": 7},
                    {"usage": "19.25", "no": 8},
                    {"usage": "19.35", "no": 9},
                    {"usage": "15.25", "no": 10},
                    {"usage": "27.85", "no": 11},
                    {"usage": "13.15", "no": 12},
                    {"usage": "28.45", "no": 13},
                    {"usage": "19.55", "no": 14},
                    {"usage": "27.95", "no": 15},
                    {"usage": "18.05", "no": 16}
                ],
                "total": "20.25",
                "temps": {"mainTemp": 65.8, "maxTemp": null}
            },
            "gpuData": [
                {
                    "model": "Navi 10 [Radeon RX 5600 OEM/5600 XT / 5700/5700 XT]",
                    "memory": {
                        "used": "N/A",
                        "total": "N/A",
                        "free": "N/A",
                        "utilization": "N/A"
                    },
                    "utilization": "N/A",
                    "temp": "N/A",
                    "power": "N/A",
                    "clocks": {"core": "N/A", "memory": "N/A"}
                }
            ],
            "childProcesses": [
                {"pid": 33354, "name": "node", "cpu": 8.2156992422262868, "memory": 1.0, "user": "sammy"},
                {"pid": 10377, "name": "webstorm", "cpu": 3.5239613274105043, "memory": 12.0, "user": "sammy"},
                {"pid": 3337, "name": "Xwayland", "cpu": 0.889890253462242, "memory": 1.2, "user": "sammy"},
                {"pid": 2805, "name": "gnome-shell", "cpu": 0.77178207473216615, "memory": 2.2, "user": "sammy"},
                {"pid": 11363, "name": "", "cpu": 0.6978834596289522, "memory": 4.1, "user": "sammy"},
                {"pid": 1510, "name": "NetworkManager", "cpu": 0.29138489678599424, "memory": 0.7, "user": "root"},
                {"pid": 11739, "name": "firefox", "cpu": 0.29033969166448915, "memory": 1.8, "user": "sammy"},
                {"pid": 1316, "name": "@dbus-daemon", "cpu": 0.26511366605696367, "memory": 0.7, "user": "messagebus"},
                {"pid": 12102, "name": "firefox", "cpu": 0.24316435850535669, "memory": 1.4, "user": "sammy"},
                {"pid": 12069, "name": "firefox", "cpu": 0.190310948523647765, "memory": 2.4, "user": "sammy"}
            ],
            "interfaces": [
                {
                    "name": "wlp4s0",
                    "default": true,
                    "mac": "4c:49:6c:4a:9d:68",
                    "type": "wireless",
                    "addresses": {"ip4": "192.168.0.67", "ip6": "fd73:759f:fb95:c124:d903:898c:decc:d62d"},
                    "data": {"transmitted": "96.15", "received": "441.95"}
                },
                {
                    "name": "lo",
                    "default": false,
                    "mac": "00:00:00:00:00:00",
                    "type": "virtual",
                    "addresses": {"ip4": "127.0.0.1", "ip6": "::1"},
                    "data": {"transmitted": "3655.75", "received": "3655.75"}
                }
            ],
            "disks": {
                "totalDiskUsage": {
                    "rIO": 179445,
                    "wIO": 215445,
                    "rIO_sec": "0.32",
                    "wIO_sec": "3.65",
                    "rx_sec": 16,
                    "wx_sec": 8512.349949849549
                },
                "disks": [
                    {
                        "name": "Samsung SSD 970 EVO Plus 2TB",
                        "type": "NVMe",
                        "vendor": "Samsung",
                        "device": "/dev/nvme0n1",
                        "size": "1.82TB",
                        "interfaceType": "PCIe"
                    },
                    {
                        "name": "KINGSTON SNV2S500G",
                        "type": "NVMe",
                        "vendor": "Kingston Technology",
                        "device": "/dev/nvme1n1",
                        "size": "465.76GB",
                        "interfaceType": "PCIe"
                    }
                ]
            }
        },
        {
            "hostName": "sam-box",
            "deviceData": [
                {"label": "Platform", "value": "linux"},
                {"label": "Name", "value": "Linux"},
                {"label": "Release", "value": "6.8.0-90-generic"},
                {"label": "Architecture", "value": "x64"},
                {"label": "Version", "value": "#91-Ubuntu SMP PREEMPT_DYNAMIC Tue Nov 18 14:14:30 UTC 2025"}
            ],
            "memoryUsage": {
                "available": "67.35",
                "usage": "32.65"
            },
            "cpuUsage": {
                "cores": [
                    {"usage": "10.15", "no": 1},
                    {"usage": "8.85", "no": 2},
                    {"usage": "7.95", "no": 3},
                    {"usage": "8.05", "no": 4},
                    {"usage": "5.45", "no": 5},
                    {"usage": "11.65", "no": 6},
                    {"usage": "5.35", "no": 7},
                    {"usage": "7.95", "no": 8},
                    {"usage": "8.05", "no": 9},
                    {"usage": "5.45", "no": 10},
                    {"usage": "11.25", "no": 11},
                    {"usage": "3.35", "no": 12},
                    {"usage": "11.55", "no": 13},
                    {"usage": "8.15", "no": 14},
                    {"usage": "11.45", "no": 15},
                    {"usage": "6.85", "no": 16}
                ],
                "total": "8.15",
                "temps": {"mainTemp": 60.8, "maxTemp": null}
            },
            "gpuData": [
                {
                    "model": "Navi 10 [Radeon RX 5600 OEM/5600 XT / 5700/5700 XT]",
                    "memory": {
                        "used": "N/A",
                        "total": "N/A",
                        "free": "N/A",
                        "utilization": "N/A"
                    },
                    "utilization": "N/A",
                    "temp": "N/A",
                    "power": "N/A",
                    "clocks": {"core": "N/A", "memory": "N/A"}
                }
            ],
            "childProcesses": [
                {"pid": 33354, "name": "node", "cpu": 4.6156992422262868, "memory": 1.1, "user": "sammy"},
                {"pid": 10377, "name": "webstorm", "cpu": 1.9239613274105043, "memory": 12.1, "user": "sammy"},
                {"pid": 3337, "name": "Xwayland", "cpu": 0.689890253462242, "memory": 1.3, "user": "sammy"},
                {"pid": 2805, "name": "gnome-shell", "cpu": 0.58178207473216615, "memory": 2.3, "user": "sammy"},
                {"pid": 11363, "name": "", "cpu": 0.5178834596289522, "memory": 4.2, "user": "sammy"},
                {"pid": 1510, "name": "NetworkManager", "cpu": 0.19138489678599424, "memory": 0.8, "user": "root"},
                {"pid": 11739, "name": "firefox", "cpu": 0.19033969166448915, "memory": 1.9, "user": "sammy"},
                {"pid": 1316, "name": "@dbus-daemon", "cpu": 0.16511366605696367, "memory": 0.8, "user": "messagebus"},
                {"pid": 12102, "name": "firefox", "cpu": 0.14316435850535669, "memory": 1.5, "user": "sammy"},
                {"pid": 12069, "name": "firefox", "cpu": 0.100310948523647765, "memory": 2.5, "user": "sammy"}
            ],
            "interfaces": [
                {
                    "name": "wlp4s0",
                    "default": true,
                    "mac": "4c:49:6c:4a:9d:68",
                    "type": "wireless",
                    "addresses": {"ip4": "192.168.0.67", "ip6": "fd73:759f:fb95:c124:d903:898c:decc:d62d"},
                    "data": {"transmitted": "98.75", "received": "451.75"}
                },
                {
                    "name": "lo",
                    "default": false,
                    "mac": "00:00:00:00:00:00",
                    "type": "virtual",
                    "addresses": {"ip4": "127.0.0.1", "ip6": "::1"},
                    "data": {"transmitted": "3678.75", "received": "3678.75"}
                }
            ],
            "disks": {
                "totalDiskUsage": {
                    "rIO": 181365,
                    "wIO": 217555,
                    "rIO_sec": "0.38",
                    "wIO_sec": "3.95",
                    "rx_sec": 19,
                    "wx_sec": 8581.349949849549
                },
                "disks": [
                    {
                        "name": "Samsung SSD 970 EVO Plus 2TB",
                        "type": "NVMe",
                        "vendor": "Samsung",
                        "device": "/dev/nvme0n1",
                        "size": "1.82TB",
                        "interfaceType": "PCIe"
                    },
                    {
                        "name": "KINGSTON SNV2S500G",
                        "type": "NVMe",
                        "vendor": "Kingston Technology",
                        "device": "/dev/nvme1n1",
                        "size": "465.76GB",
                        "interfaceType": "PCIe"
                    }
                ]
            }
        },
        {
            "hostName": "sam-box",
            "deviceData": [
                {"label": "Platform", "value": "linux"},
                {"label": "Name", "value": "Linux"},
                {"label": "Release", "value": "6.8.0-90-generic"},
                {"label": "Architecture", "value": "x64"},
                {"label": "Version", "value": "#91-Ubuntu SMP PREEMPT_DYNAMIC Tue Nov 18 14:14:30 UTC 2025"}
            ],
            "memoryUsage": {
                "available": "66.85",
                "usage": "33.15"
            },
            "cpuUsage": {
                "cores": [
                    {"usage": "8.75", "no": 1},
                    {"usage": "7.45", "no": 2},
                    {"usage": "6.55", "no": 3},
                    {"usage": "6.65", "no": 4},
                    {"usage": "4.15", "no": 5},
                    {"usage": "10.25", "no": 6},
                    {"usage": "4.05", "no": 7},
                    {"usage": "6.55", "no": 8},
                    {"usage": "6.65", "no": 9},
                    {"usage": "4.15", "no": 10},
                    {"usage": "9.85", "no": 11},
                    {"usage": "2.05", "no": 12},
                    {"usage": "10.15", "no": 13},
                    {"usage": "6.75", "no": 14},
                    {"usage": "10.05", "no": 15},
                    {"usage": "5.55", "no": 16}
                ],
                "total": "6.75",
                "temps": {"mainTemp": 59.5, "maxTemp": null}
            },
            "gpuData": [
                {
                    "model": "Navi 10 [Radeon RX 5600 OEM/5600 XT / 5700/5700 XT]",
                    "memory": {
                        "used": "N/A",
                        "total": "N/A",
                        "free": "N/A",
                        "utilization": "N/A"
                    },
                    "utilization": "N/A",
                    "temp": "N/A",
                    "power": "N/A",
                    "clocks": {"core": "N/A", "memory": "N/A"}
                }
            ],
            "childProcesses": [
                {"pid": 33354, "name": "node", "cpu": 4.1156992422262868, "memory": 1.2, "user": "sammy"},
                {"pid": 10377, "name": "webstorm", "cpu": 1.7239613274105043, "memory": 12.2, "user": "sammy"},
                {"pid": 3337, "name": "Xwayland", "cpu": 0.649890253462242, "memory": 1.4, "user": "sammy"},
                {"pid": 2805, "name": "gnome-shell", "cpu": 0.54178207473216615, "memory": 2.4, "user": "sammy"},
                {"pid": 11363, "name": "", "cpu": 0.4778834596289522, "memory": 4.3, "user": "sammy"},
                {"pid": 1510, "name": "NetworkManager", "cpu": 0.17138489678599424, "memory": 0.9, "user": "root"},
                {"pid": 11739, "name": "firefox", "cpu": 0.17033969166448915, "memory": 2.0, "user": "sammy"},
                {"pid": 1316, "name": "@dbus-daemon", "cpu": 0.15011366605696367, "memory": 0.9, "user": "messagebus"},
                {"pid": 12102, "name": "firefox", "cpu": 0.12816435850535669, "memory": 1.6, "user": "sammy"},
                {"pid": 12069, "name": "firefox", "cpu": 0.085310948523647765, "memory": 2.6, "user": "sammy"}
            ],
            "interfaces": [
                {
                    "name": "wlp4s0",
                    "default": true,
                    "mac": "4c:49:6c:4a:9d:68",
                    "type": "wireless",
                    "addresses": {"ip4": "192.168.0.67", "ip6": "fd73:759f:fb95:c124:d903:898c:decc:d62d"},
                    "data": {"transmitted": "101.35", "received": "461.55"}
                },
                {
                    "name": "lo",
                    "default": false,
                    "mac": "00:00:00:00:00:00",
                    "type": "virtual",
                    "addresses": {"ip4": "127.0.0.1", "ip6": "::1"},
                    "data": {"transmitted": "3701.75", "received": "3701.75"}
                }
            ],
            "disks": {
                "totalDiskUsage": {
                    "rIO": 183285,
                    "wIO": 219665,
                    "rIO_sec": "0.42",
                    "wIO_sec": "4.25",
                    "rx_sec": 21,
                    "wx_sec": 8650.349949849549
                },
                "disks": [
                    {
                        "name": "Samsung SSD 970 EVO Plus 2TB",
                        "type": "NVMe",
                        "vendor": "Samsung",
                        "device": "/dev/nvme0n1",
                        "size": "1.82TB",
                        "interfaceType": "PCIe"
                    },
                    {
                        "name": "KINGSTON SNV2S500G",
                        "type": "NVMe",
                        "vendor": "Kingston Technology",
                        "device": "/dev/nvme1n1",
                        "size": "465.76GB",
                        "interfaceType": "PCIe"
                    }
                ]
            }
        }
    ]

    const [logoImage, setLogoImage] = useState(() => Sparkr)

    const [activeView, setActiveView] = useState("resources")

    function changeFont (type, size) {
        switch (type) {
            case "text":        document.documentElement.style.setProperty(`--font-size`, `${size}px`);
                break;
            case "header":     document.documentElement.style.setProperty(`--font-size-header`, `${size}px`);
        }
    }

    const [fontClicked, setFontClicked] = useState("medium");

    const [metrics, setMetrics] = useState({"hostName":"sam-box","deviceData":[{"label":"Platform","value":"linux"},{"label":"Name","value":"Linux"},{"label":"Release","value":"6.8.0-90-generic"},{"label":"Architecture","value":"x64"},{"label":"Version","value":"#91-Ubuntu SMP PREEMPT_DYNAMIC Tue Nov 18 14:14:30 UTC 2025"}],"memoryUsage":{"available":"70.69","usage":"29.31"},"cpuUsage":{"cores":[{"usage":"1.01","no":1},{"usage":"3.06","no":2},{"usage":"7.07","no":3},{"usage":"2.00","no":4},{"usage":"4.00","no":5},{"usage":"4.04","no":6},{"usage":"4.08","no":7},{"usage":"4.04","no":8},{"usage":"4.95","no":9},{"usage":"3.00","no":10},{"usage":"1.00","no":11},{"usage":"4.08","no":12},{"usage":"6.06","no":13},{"usage":"1.00","no":14},{"usage":"3.06","no":15},{"usage":"3.00","no":16}],"total":"3.38","temps":{"mainTemp":59.4,"maxTemp":null}},"gpuData":[{"model":"Navi 10 [Radeon RX 5600 OEM/5600 XT / 5700/5700 XT]","memory":{"used":"N/A","total":"N/A","free":"N/A","utilization":"N/A"},"utilization":"N/A","temp":"N/A","power":"N/A","clocks":{"core":"N/A","memory":"N/A"}}],"childProcesses":[{"pid":10377,"name":"webstorm","cpu":2.4614708099505824,"memory":11.2,"user":"sammy"},{"pid":33354,"name":"node","cpu":2.1850657509004106,"memory":0.3,"user":"sammy"},{"pid":11363,"name":"","cpu":0.8616718318117095,"memory":3.7,"user":"sammy"},{"pid":3337,"name":"Xwayland","cpu":0.6323812714632717,"memory":0.5,"user":"sammy"},{"pid":2805,"name":"gnome-shell","cpu":0.4564871429767987,"memory":1.5,"user":"sammy"},{"pid":12269,"name":"full-line-inference","cpu":0.24918334868916997,"memory":1.1,"user":"sammy"},{"pid":11739,"name":"firefox","cpu":0.1748471396264344,"memory":0.9,"user":"sammy"},{"pid":1510,"name":"NetworkManager","cpu":0.09946394170366028,"memory":0,"user":"root"},{"pid":1316,"name":"@dbus-daemon","cpu":0.09213501968339056,"memory":0,"user":"messagebus"},{"pid":12102,"name":"firefox","cpu":0.05339643186196499,"memory":0.7,"user":"sammy"}],"interfaces":[{"name":"wlp4s0","default":true,"mac":"4c:49:6c:4a:9d:68","type":"wireless","addresses":{"ip4":"192.168.0.67","ip6":"fd73:759f:fb95:c124:d903:898c:decc:d62d"},"data":{"transmitted":"1470.82","received":"1979.23"}},{"name":"lo","default":false,"mac":"00:00:00:00:00:00","type":"virtual","addresses":{"ip4":"127.0.0.1","ip6":"::1"},"data":{"transmitted":"3638.97","received":"3638.97"}}],"disks":{"totalDiskUsage":{"rIO":170333,"wIO":163665,"rIO_sec":"0.00","wIO_sec":"0.00","rx_sec":0,"wx_sec":0},"disks":[{"name":"Samsung SSD 970 EVO Plus 2TB","type":"NVMe","vendor":"Samsung","device":"/dev/nvme0n1","size":"1.82TB","interfaceType":"PCIe"},{"name":"KINGSTON SNV2S500G","type":"NVMe","vendor":"Kingston Technology","device":"/dev/nvme1n1","size":"465.76GB","interfaceType":"PCIe"}]}}
)

    useEffect(() => {
        setInterval(() => {
            const index = Math.floor(Math.random() * metricArray.length);
            setMetrics(metricArray[index]);
        }, 1000);
    }, [])
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
        if (darkMode) {
            return true
        } else {
            return false
        }
    });

    const [viewPort,setViewPort ] = useState([]);

    let windowWidth = window.innerWidth

    // useEffect(() => {
    //     if (windowWidth <= 900 && fontClicked === 'large') {
    //         changeFont('text', 20);
    //         setFontClicked("medium");
    //     }
    // }, [windowWidth, fontClicked]);


    useEffect(() => {
        const handleResize = () => {
            setViewPort(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [windowWidth])

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark-mode");
        } else {
            document.documentElement.classList.remove("dark-mode");
        }    }, [isDarkMode])

    // useEffect( () => {
    //     console.log("[APP_METRICS] Getting metrics")
    //     try {
    //         const interval = setInterval(async () => {
    //             const response = await fetch (`http://${selectedDevice}:3000`)
    //             if (response.ok) {
    //                 if (response.status === 200) {
    //                     const resData = await response.json()
    //
    //                     if (resData === null) {
    //                         console.error("[APP_METRICS] There was an error fetching metrics")
    //                     } else {
    //                         setMetrics(resData)
    //                         console.log(JSON.stringify(resData))
    //                     }
    //                 }else {
    //                     console.log("[APP_METRICS] There was an error fetching metrics")
    //                 }
    //             }
    //         }, 1000)
    //         return () => clearInterval(interval)
    //     } catch (err) {
    //         console.error("[APP_METRICS] Error getting metrics: ", err.message)
    //         handleNotification("error", "There was an error fetching metrics")
    //     }
    // }, [selectedDevice])

    // let deviceButtonList
    // if (devices){
    //     deviceButtonList = devices.map((device) => {
    //         return(<button className={selectedDevice === device.ip ?"general-button disabled-button": "general-button"} onClick={() => changeRemoteDevice(device.ip)} style={{
    //             minWidth: "fit-content",
    //             maxWidth: "fit-content",
    //         }}>{device.name}</button>)
    //     })
    // }

    return (
        <>
            {(activeView === 'resources' || activeView === "fullScreen") && <div style={{marginLeft: '20px',}} onClick={() => {
                if (activeView === "resources") {
                    setActiveView("fullScreen")
                } else {
                    setActiveView("resources")
                }
            }} title={activeView === 'fullScreen' ? "Minimise" : "Maximise"}>
                <img className={'full-screen__close'} alt={'expand icon'}
                     src={activeView === 'fullScreen' ? isDarkMode ? CollapseWhite : CollapseBlack : isDarkMode ? ExpandWhite : ExpandBlack}></img>
            </div>}
            <Header metrics={metrics}
                    setIsDarkMode={setIsDarkMode}
                    isDarkMode={isDarkMode}
                    setActiveView={setActiveView}
                    activeView={activeView}
                    logoImage={logoImage}
            />
            <main>
                {metrics !== null &&
                    <>
                        {(activeView === "resources" || activeView === "fullScreen") &&<>
                            <div className={"left-column"}>
                                <ChildProcesses metrics={metrics}/>
                                <DeviceData metrics={metrics}/>
                                <DiskData metrics={metrics}/>

                            </div>

                            <div className={"right-column"}>
                                <CpuData metrics={metrics}/>
                                <MemoryData metrics={metrics}
                                            viewPort={viewPort}
                                />
                                <NetworkData metrics={metrics}/>
                            </div>
                        </>}
                    </>
                }
            </main>
        </>
    )
}