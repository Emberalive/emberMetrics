import TextArea from "./TextArea.jsx";
import FrontEndOutPut from '../assets/run-front-end-output.png'
import BackEndOutPut from '../assets/host-api-run-output.png'
import InitialAppStart from '../assets/initial-app-start.png'

export default function GettingStarted(props) {
    return (
        <section style={{ height: "100%", borderRadius: 0, border: 'none'}}>
            <h1>Getting Started</h1>
            <TextArea isDarkMode={props.isDarkMode} data={{
                text: [{
                    text: 'Getting Started: \n \nEmber Metrics is designed to be an easy to use and install application, with minimal set up and little complexity.\n \n' +
                        'There will be 2 ways to set up the application, running the application natively or through a docker container. However currently there is no docker image. \n\nInstall Node.js: For Debian based linux Distro\'s:',
                img: null}
                , {text: 'Ensure that you clone the repository:', img: null},
                    {text: 'Making sure that your in the root directory ./<repo-name>. Run the front end locally', img: FrontEndOutPut},
                    {text: 'This will start the front end, clicking the link displayed in the output will open the front end in the browser.', image: null}
                , {
                        text: 'Run the API locally:',
                        img: BackEndOutPut
                    }, {
                        text: 'Now when you open the web App, you should see this from::',
                        img: InitialAppStart
                    },
                    {
                        text: 'This from is asking what device your viewing from. Depending on the device that your using ' +
                            'It changes how it accesses the central application for device management.' +
                            '\n\nIf your viewing it from the same device its running from select Host, if its a different device' +
                            'select Remote Access',
                        img: null
                    }],
                code: [{code: 'sudo apt install node', language: 'bash'}, {code: 'git clone https://github.com/Emberalive/emberMetrics\n' +
                        'cd embermetrics', language: 'bash'}, {code: 'cd emberMetrics\n' +
                        'npm install\n' +
                        'npm run dev', language: 'bash'}, {code: null, language: null},
                    {code: 'cd metrics-api\n' +
                            'npm install\n' +
                            'npm run dev',
                        language: 'bash'},
                    {code: null, language: null},
                    {code: null, language: null},
                    ]
            }}/>
        </section>
    )
}