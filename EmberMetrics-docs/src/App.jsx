import './index.css'
import {useEffect, useState} from "react";
import Menu from "./components/Menu";
import TextArea from "./components/TextArea.jsx";
import LogoLight from "./assets/metrics-logo_light.svg";
import LogoDark from "./assets/metrics-logo_dark.svg";
import Tester from "./components/Tester.jsx";
import Sparkr from "./assets/SVG 2.1 | Original Sparkr.svg";
import ProcessesImg from "./assets/processes-img.png";
import NetworkInterfaceImg from "./assets/network-interface-img.png";
import DiskDataImg from "./assets/disk-data-img.png";
import DeviceManagementImg from "./assets/device-management-img.png";
import SettingsImg from "./assets/settings-img.png";
import FullScreenMetricsImg from "./assets/full-screen-metrics-img.png";
import GettingStarted from "./components/GettingStarted.jsx";

export default function App() {
    const [logoImage, setLogoImage] = useState(() => Sparkr)

    const [testerView, setTesterView] = useState('resources')

    const [activeView, setActiveView] = useState('home');

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
        if (darkMode) {
            return true
        } else {
            return false
        }
    });

    const savedTheme = JSON.parse(localStorage.getItem("theme"));


    useEffect(() => {
        if (savedTheme) {
            document.documentElement.style.setProperty("--secondary", savedTheme.colour.secondary);
            document.documentElement.style.setProperty("--tertiary", savedTheme.colour.tertiary);

            document.documentElement.style.setProperty("--dm-tertiary", savedTheme.colour.tertiary)
            document.documentElement.style.setProperty("--dm-secondary", savedTheme.colour.secondary)
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLogoImage(savedTheme.logo)
        }
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark-mode");
        } else {
            document.documentElement.classList.remove("dark-mode");
        }    }, [isDarkMode])

    return (
        <main>
            {testerView !== 'fullScreen' &&
                <>
                    <Menu setActiveView={setActiveView} activeView={activeView} logoImage={logoImage}/>
                    {activeView === 'home' && <section>
                        {activeView === 'home' &&
                            <>
                                <div id={'logo-wrapper'}>
                                    <img  src={isDarkMode ? LogoDark : LogoLight} alt={isDarkMode ? "dark Logo" : "light logo"}/>
                                </div>
                                <TextArea data={{
                                    text: [{
                                        title: '\'Monitor, manage, and understand your infrastructure - on your own terms.\'',
                                        text: 'EmberMetrics is a self-hosted monitoring and system administration platform that delivers real-time system metrics, remote device visibility, and centralized management without relying on external SaaS providers. Built for developers, sysadmins, and homelab environments, EmberMetrics combines lightweight collectors with a modern web dashboard to give you complete control over your monitoring stack.',
                                        img: null,
                                    }],
                                    code: [{
                                        code: null,
                                        language: null,
                                    }]
                                }}/>
                                <h1>Key Benefits</h1>
                                <TextArea data={{
                                    text: [
                                        {text: '- Run entirely on your own infrastructure with no external dependencies.\n' +
                                    '\n' +
                                    '- Keep your system data private and under your control.',
                                    img: null,
                                    title: 'Full Control, No SaaS Lock-In'
                                },
                                {
                                    text: '- See CPU, memory, processes, network, and storage usage in real time.\n' +
                                    '\n' +
                                    '- Quickly identify resource bottlenecks and misbehaving processes.',
                                    img: null,
                                    title: 'Real-Time Operational Visibility',
                                }],
                                    code: [{}]
                                }}/>
                                <TextArea data={{
                                    text: [
                                        {text: '- Run entirely on your own infrastructure with no external dependencies.\n' +
                                                '\n' +
                                                '- Keep your system data private and under your control.',
                                            img: null,
                                            title: 'Full Control, No SaaS Lock-In'
                                        },
                                        {
                                            text: '- See CPU, memory, processes, network, and storage usage in real time.\n' +
                                                '\n' +
                                                '- Quickly identify resource bottlenecks and misbehaving processes.',
                                            img: null,
                                            title: 'Real-Time Operational Visibility',
                                        }],
                                    code: [{}]
                                }}/>
                                <TextArea data={{
                                    text: [
                                        {
                                            text: '- Structured JSON output makes integration and customization easy.\n' +
                                                '\n' +
                                                '- Designed to evolve with historical metrics, and automation.',
                                            img: null,
                                            title: 'Extensible by Design'
                                        },
                                        {
                                            text: 'Each monitored device runs a lightweight EmberMetrics collector that exposes' +
                                                ' real-time system metrics over HTTP. These collectors are designed to be low overhead, ' +
                                                'read-only, and easy to deploy on internal systems.',
                                            img: null,
                                            title: 'Lightweight Collectors (Remote Devices)'
                                        }
                                    ],
                                    code: [{}]
                                }}/>
                                <h1>Architecture Overview</h1>
                                <TextArea data={{
                                    text: [
                                        {
                                            text: 'Each monitored device runs a lightweight EmberMetrics collector that exposes' +
                                                ' real-time system metrics over HTTP. These collectors are designed to be low overhead, ' +
                                                'read-only, and easy to deploy on internal systems.',
                                            img: null,
                                            title: 'Lightweight Collectors (Remote Devices)'
                                        }
                                    ],
                                    code: [{}]
                                }}/>
                                <TextArea data={{
                                    text: [
                                        {
                                            text: 'The hosted EmberMetrics API acts as the control plane, providing local system ' +
                                                'metrics while managing a persistent list of remote devices. This central host is ' +
                                                'responsible for coordinating device access and serving data to the dashboard.',
                                            img: null,
                                            title: 'Central Host & Control Plane'
                                        }
                                    ],
                                    code: [{}]
                                }}/>
                                <TextArea data={{
                                    text: [
                                        {
                                            text: 'The EmberMetrics web dashboard connects to the hosted API to present system ' +
                                                'metrics, device information, and management controls in a modern, responsive ' +
                                                'interface. This separation allows the UI to remain flexible while the data layer ' +
                                                'stays lightweight and reliable.',
                                            img: null,
                                            title: 'Web Dashboard'
                                        }
                                    ],
                                    code: [{
                                        code: null,
                                        language: null,
                                    }]
                                }}/>
                            </>
                    }
                    </section>}
                </>
            }
            {activeView === 'getting-started' &&
                <section>
                    <GettingStarted isDarkMode={isDarkMode}/>
                </section>
            }
            {activeView === 'tester' && <>
            {testerView !== 'fullScreen' &&
                <>
                    <section>
                        <h1>EmberMetrics Visual Interface Showcase: The User Experience</h1>
                        <TextArea data={{
                            text: [{
                                text: "EmberMetrics transforms raw system data into an intelligent visual narrative that tells the story of your" +
                                        " computer's performance in real time. This isn't just another monitoring tool - it's a visual translation layer that " +
                                    "converts complex technical metrics into intuitive, actionable insights that anyone can understand.\n" +
                                    "\n" +
                                    "The interface serves as the central nervous system of the application, where data from multiple " +
                                    "sources converges into a cohesive, comprehensible display. Each visual element is carefully designed not merely to present " +
                                    "information, but to reveal patterns, highlight anomalies, and enable rapid decision-making. The dashboard acts as your digital co-pilot " +
                                    "for system management, providing both high-level overviews for quick status checks and granular details for deep troubleshooting.",
                                img: null
                            }],
                            code: []
                        }}/>
                    </section>
                    <div className={'page-break'}></div>
                </>}
                <Tester logoImage={logoImage} setLogoImage={setLogoImage} activeView={testerView} setActiveView={setTesterView} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </>}
            {activeView === 'features' &&<section>
                <h1>Features</h1>
                <TextArea data={{
                    text: [{
                        text: "EmberMetrics provides real-time system visibility and centralized device management through a lightweight, " +
                            "self-hosted architecture. It is designed to deliver the information you need to understand system health, " +
                            "diagnose performance issues, and manage multiple machines — without relying on external monitoring services."
                    }],
                    code: []
                }}
                />
                <TextArea data={{
                    text: [{
                        title: 'Real-Time System Metrics',
                        text: 'Get an up-to-date view of system performance across all monitored devices.\n' +
                            '\n' +
                            '- Per-core and total CPU usage\n' +
                            '\n' +
                            '- CPU temperature monitoring (where supported)\n' +
                            '\n' +
                            '- Memory usage and availability\n' +
                            '\n' +
                            '- Structured JSON output for reliable consumption\n' +
                            '\n' +
                            'Designed for fast refresh rates and low overhead, EmberMetrics focuses on delivering actionable system data in real time'
                    }],
                    code: [{
                        code: null,
                        language: null,
                    }]
                }}/>
                <TextArea data={{
                    text: [{
                        title: 'Process & Resource Visibility',
                        text: 'Identify resource-intensive workloads and troubleshoot performance issues quickly.\n' +
                            '\n' +
                            '- Top processes by CPU usage\n' +
                            '\n' +
                            '- Process ID, name, user, and memory usage\n' +
                            '\n' +
                            '- Designed to surface runaway or misbehaving processes\n' +
                            '\n' +
                            '- Optimized for operational insight rather than exhaustive process listings\n' +
                            '\n' +
                            'This allows you to quickly understand what is consuming resources and where performance is being impacted.',
                        img: ProcessesImg
                    }],
                    code: [{
                        code: null,
                        language: null,
                    }]
                }}/>
                <TextArea data={{
                    text: [{
                        title: 'Network Interface Monitoring',
                        text: 'Maintain visibility into network configuration and activity.\n' +
                            '\n' +
                            '- Enumeration of network interfaces\n' +
                            '\n' +
                            '- MAC addresses and interface types\n' +
                            '\n' +
                            '- Default interface detection\n' +
                            '\n' +
                            '- IPv4 and IPv6 addresses\n' +
                            '\n' +
                            '- Transmitted and received data counters\n' +
                            '\n' +
                            'This helps with diagnosing connectivity issues and understanding network layout across systems.',
                        img: NetworkInterfaceImg
                    }],
                    code: [{
                        code: null,
                        language: null,
                    }]
                }}/>
                <TextArea data={{
                    text: [{
                        title: 'Storage & Disk Enumeration',
                        text: 'Track storage devices and system layout.\n' +
                            '\n' +
                            '- Disk and drive detection\n' +
                            '\n' +
                            '- Device paths and interface types\n' +
                            '\n' +
                            '- Vendor and device metadata\n' +
                            '\n' +
                            '- Capacity reporting\n' +
                            '\n' +
                            '- Support for modern storage types such as NVMe\n' +
                            '\n' +
                            'Provides a clear view of available storage resources and system configuration.',
                        img: DiskDataImg
                    }],
                    code: [{
                        code: null,
                        language: null,
                    }]
                }}/>
                <TextArea data={{
                    text: [{
                        title: 'Multi-Device Management',
                        text: 'Monitor and manage multiple systems from a single interface.\n' +
                            '\n' +
                            '- Register and manage remote devices\n' +
                            '\n' +
                            '- Centralized device list\n' +
                            '\n' +
                            '- Designed for both local and remote monitoring scenarios\n' +
                            '\n' +
                            '- Lightweight remote collectors with centralized visibility\n' +
                            '\n' +
                            'This enables a single control plane for small clusters, homelabs, and internal infrastructure.',
                        img: DeviceManagementImg
                    }],
                    code: [{
                        code: null,
                        language: null,
                    }]
                }}/>
                <TextArea data={{
                    text: [{
                        title: 'Structured Data for Dashboards & Automation',
                        text: 'EmberMetrics is built around consistent, structured JSON output.\n' +
                            '\n' +
                            '- Predictable API responses\n' +
                            '\n' +
                            '- Designed for integration with custom dashboards\n' +
                            '\n' +
                            '- Suitable for automation and external tooling\n' +
                            '\n' +
                            '- Clear separation between data collection and presentation\n' +
                            '\n' +
                            'This makes EmberMetrics easy to extend and integrate into existing workflows.'
                    }],
                    code: [{
                        code: null,
                        language: null,
                    }]
                }}/>
                <TextArea data={{
                    text: [{
                        title: 'UI & Accessibility Controls',
                        text: 'Customize the dashboard experience to fit your environment.\n' +
                            '\n' +
                            '- Light and dark themes\n' +
                            '\n' +
                            '- Multiple predefined color themes\n' +
                            '\n' +
                            '- Adjustable global font sizing\n' +
                            '\n' +
                            '- Accessibility-focused layout considerations\n' +
                            '\n' +
                            'Designed for both desktop use and wallboard-style displays.',
                        img: SettingsImg
                    }],
                    code: [{
                        code: null,
                        language: null,
                    }]
                }}/>
                <TextArea data={{
                    text: [{
                        title: 'Fullscreen & Monitoring Displays',
                        text: 'Support for focused monitoring setups.\n' +
                            '\n' +
                            '- Fullscreen dashboard mode\n' +
                            '\n' +
                            '- Suitable for wall displays and monitoring stations\n' +
                            '\n' +
                            '- Clean, distraction-free layout\n' +
                            '\n' +
                            '- Designed for continuous visibility\n' +
                            '\n' +
                            'Ideal for NOCs, server rooms, or dedicated monitoring screens.',
                        img: FullScreenMetricsImg
                    }],
                    code: [{
                        code: null,
                        language: null,
                    }]
                }}/>
                <TextArea data={{
                    text: [{
                        title: 'Lightweight & Self-Hosted by Design',
                        text: 'Built to be simple to deploy and easy to operate.\n' +
                            '\n' +
                            '- Node.js-based collectors and APIs\n' +
                            '\n' +
                            '- No external databases required (current design)\n' +
                            '\n' +
                            '- JSON-based persistence\n' +
                            '\n' +
                            '- Designed for trusted and internal networks\n' +
                            '\n' +
                            'EmberMetrics prioritizes simplicity, control, and operational transparency.'
                    }],
                    code: [{
                        code: null,
                        language: null,
                    }]
                }}/>
                <TextArea data={{
                    text: [{
                        title: 'Designed to Grow',
                        text: 'EmberMetrics is actively evolving to support more advanced monitoring workflows.\n' +
                            '\n' +
                            '- Historical metrics storage\n' +
                            '\n' +
                            '- Threshold-based alerts and notifications\n' +
                            '\n' +
                            '- Authentication and access control\n' +
                            '\n' +
                            '- Role-based access management\n' +
                            '\n' +
                            '- Graphing and long-term trend visualization\n' +
                            '\n' +
                            '- Docker Compose-based deployments\n' +
                            '\n' +
                            'These capabilities are designed to extend EmberMetrics into a full observability and operations platform.'
                    }],
                    code: [{
                        code: null,
                        language: null,
                    }]
                }}/>

            </section>}
        </main>
    )
}