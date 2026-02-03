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
        <>
            {testerView !== 'fullScreen' &&
                <>
                    <Menu setActiveView={setActiveView} activeView={activeView} logoImage={logoImage}/>
                    <section style={{ height: "100%", borderRadius: 0, border: 'none'}}>
                        {activeView === 'home' &&
                            <>
                                <div id={'logo-wrapper'}>
                                    <img  src={isDarkMode ? LogoDark : LogoLight} alt={isDarkMode ? "dark Logo" : "light logo"}/>
                                </div>
                                <TextArea text={testData} code={testCode} isDarkMode={isDarkMode} language={"javascript"}/>
                            </>
                    }
                    </section>
                </>
            }
            {activeView === 'tester' && <>
            {testerView !== 'fullScreen' &&
                <>
                    <section style={{height: "100%", borderRadius: 0, border: 'none'}}>
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
            {activeView === 'getting-started' && <GettingStarted isDarkMode={isDarkMode}/>}
        </>
    )

}