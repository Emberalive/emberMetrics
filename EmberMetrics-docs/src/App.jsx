import './index.css'
import {useEffect, useState} from "react";
import Menu from "./components/Menu";
import TextArea from "./components/TextArea.jsx";
import LogoLight from "./assets/metrics-logo_light.svg";
import LogoDark from "./assets/metrics-logo_dark.svg";
import Tester from "./components/Tester.jsx";

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
    const testData2 = {
        text: [testData],
        code: [{
            code: testCode,
            language: 'javascript',
        }],
    };

    const [activeView, setActiveView] = useState('home');

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
        if (darkMode) {
            return true
        } else {
            return false
        }
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark-mode");
        } else {
            document.documentElement.classList.remove("dark-mode");
        }    }, [isDarkMode])

    return (
        <>
            <Menu setActiveView={setActiveView} activeView={activeView}/>
            <section style={{ height: "100%", borderRadius: 0, border: 'none'}}>
                {activeView === 'home' &&
                    <>
                        <img src={isDarkMode ? LogoDark : LogoLight} alt={isDarkMode ? "dark Logo" : "light logo"}/>
                        <TextArea text={testData} code={testCode} isDarkMode={isDarkMode} language={"javascript"}/>
                    </>
            }
            </section>
            {activeView === 'tester' && <section style={{ height: "100%", borderRadius: 0, border: 'none'}}>
                <h1>EmberMetrics Visual Interface Showcase: The User Experience</h1>
                <TextArea data={{
                    text: ["EmberMetrics transforms raw system data into an intelligent visual narrative that tells the story of your computer's performance in real time. This isn't just another monitoring tool - it's a visual translation layer that converts complex technical metrics into intuitive, actionable insights that anyone can understand.\n" +
                        "\n" +
                        "The interface serves as the central nervous system of the application, where data from multiple sources converges into a cohesive, comprehensible display. Each visual element is carefully designed not merely to present information, but to reveal patterns, highlight anomalies, and enable rapid decision-making. The dashboard acts as your digital co-pilot for system management, providing both high-level overviews for quick status checks and granular details for deep troubleshooting."],
                    code: []
                }}
                          />
                <div style={{height: '1px', width: '100%', backgroundColor: 'var(--accent)'}}></div>
                <Tester />
            </section>}
        </>
    )

}