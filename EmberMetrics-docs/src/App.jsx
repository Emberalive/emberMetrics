import './index.css'
import {useEffect, useState} from "react";
import Menu from "./components/Menu";
import TextArea from "./components/TextArea.jsx";
import LogoLight from "./assets/metrics-logo_light.svg";
import LogoDark from "./assets/metrics-logo_dark.svg";
import Tester from "./components/Tester.jsx";
import Sparkr from "./assets/SVG 2.1 | Original Sparkr.svg";
import GettingStarted from "./components/GettingStarted.jsx";

export default function App() {
    //data for all of the text areas
    const testData = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \n\n" +
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.\n\n" +
        "Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi."
    const testCode = 'import { Prism as SyntaxHighlighter } from \'react-syntax-highlighter\';\n' +
        'import { oneDark } from \'react-syntax-highlighter/dist/esm/styles/prism\';\n' +
        '\n' +
        'const code = `\n' +
        'const testData = "Hello world";\n' +
        'console.log(testData);\n' +
        '`;\n' +
        '\n' +
        '<SyntaxHighlighter language="javascript" style={oneDark}>\n' +
        '  {code}\n' +
        '</SyntaxHighlighter>\n'


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
                                        text: 'Monitor, manage, and understand your infrastructure - on your own terms.\n\n' +
                                        'EmberMetrics is a self-hosted monitoring and system administration platform that delivers real-time system metrics, remote device visibility, and centralized management without relying on external SaaS providers. Built for developers, sysadmins, and homelab environments, EmberMetrics combines lightweight collectors with a modern web dashboard to give you complete control over your monitoring stack.',
                                        img: null,
                                    }],
                                    code: [{
                                        code: null,
                                        language: null,
                                    }]
                                }}/>
                                <h1>Key Benefits</h1>
                                <TextArea data={{
                                    text: [{
                                        text: '- Run entirely on your own infrastructure with no external dependencies.\n' +
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
                                        },
                                        {
                                            text: '- Ideal for homelabs, small clusters, internal servers, and dev environments.\n' +
                                                '\n' +
                                                '- Simple deployment with lightweight Node.js collectors.',
                                            img: null,
                                            title: 'Designed for Homelabs and Internal Infrastructure'
                                        },
                                        {
                                            text: '- Manage and monitor multiple remote devices from a single dashboard.\n' +
                                                '\n' +
                                                '- Keep a clear inventory of monitored systems.',
                                            img: null,
                                            title: 'Centralized Device Management'
                                        },
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
                                        },
                                            {
                                                text: 'The hosted EmberMetrics API acts as the control plane, providing local system ' +
                                                    'metrics while managing a persistent list of remote devices. This central host is ' +
                                                    'responsible for coordinating device access and serving data to the dashboard.',
                                                img: null,
                                                title: 'Central Host & Control Plane'
                                            },
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
                        }}
                        />
                    </section>
                    <div className={'page-break'}></div>
                </>}
                <Tester logoImage={logoImage} setLogoImage={setLogoImage} activeView={testerView} setActiveView={setTesterView} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </>}
        </main>
    )
}