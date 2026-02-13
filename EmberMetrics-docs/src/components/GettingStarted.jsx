import TextArea from "./TextArea.jsx";
import FrontEndOutPut from '../assets/run-front-end-output.png'
import BackEndOutPut from '../assets/host-api-run-output.png'
import InitialAppStart from '../assets/initial-app-start.png'
import Authentication from '../assets/authentication-variable.png'

export default function GettingStarted(props) {
    return (
        <>
            <h1>Getting Started</h1>
            <TextArea isDarkMode={props.isDarkMode} data={{
                text: [{
                    title: 'Run the front end locally',
                    text: 'Ember Metrics is designed to be an easy to use and install application, with minimal set up and little ' +
                        'complexity.\n \n' +
                        'There will be 2 ways to set up the application, running the application natively or through a docker container.' +
                        ' However currently there is no docker image. \n\nInstall Node.js: For Debian based linux Distro\'s:',
                },
                    {
                        text: 'Ensure that you clone the repository:'
                    },
                    {
                        text: 'Making sure that your in the root directory \'./emberMetrics\'. Run the front end locally',
                        img: FrontEndOutPut
                    },
                    {
                        text: 'This will start the front end, clicking the link displayed in the output will open the front end in the browser.'
                    }],
                code: [{code: 'sudo apt install node', language: 'bash'}, {code: 'git clone https://github.com/Emberalive/emberMetrics\n' +
                        'cd emberMetrics', language: 'bash'}, {code: 'cd emberMetrics\n' +
                        'npm install\n' +
                        'npm run dev', language: 'bash'}, {code: null, language: null},
                    {code: 'cd metrics-api\n' +
                            'npm install\n' +
                            'npm run dev',
                        language: 'bash'}]
            }}/>
            <TextArea isDarkMode={props.isDarkMode} data={{
                text: [
                    {
                        text: 'To run the API locally, you need to follow these commands. Again from the root directory \'./emberMetrics\'.',
                        img: BackEndOutPut,
                        title: 'Run the API locally:'
                    },
                    {
                        text: 'Now when you open the web App, you should see this from:',
                        img: InitialAppStart
                    },
                    {
                        text: 'This form is asking what device your viewing the dashboard from. Depending on the device that your using ' +
                            'It changes how it accesses the central application for device management.' +
                            '\n\nIf your viewing it from the same device its running from select Host, if its a different device ' +
                            'select Remote Access.',
                        img: null
                    }
                ],
                code: [
                    {code: null, language: null},
                    {code: null, language: null}
                ]
            }}/>
            <TextArea isDarkMode={props.isDarkMode} data={{
                text: [                    {
                    title: 'Exposing the front end',
                    text: 'If you want to expose the site to the public, and not only have access locally ' +
                        'You need to host the site statically on a web server.\n\n' +
                        'You will also have to do this if you want the website to be hosted over https.\n\n' +
                        'NOTE: The fetch calls dont call over (https) only http, There currently isn\'t https support, ' +
                        'this will be coming soon...'
                }],
                code: [
                    {},
                ]
            }}/>
            <TextArea isDarkMode={props.isDarkMode} data={{
                text: [
                    {
                        title: 'Front-end',
                        text: 'To host the front end, it is very simple, just follow this command, and a directory ' +
                            'called \'dist\' will be created in the root directory.\n\n' +
                            'The contents of this directory can be moved directly into your web server, and the front end ' +
                            'will be accessible.'
                }],
                code: [
                    {code: 'npm run build', language: 'bash'},
                ]
            }}/>
            <TextArea isDarkMode={props.isDarkMode} data={{
                text: [                    {
                    title: 'Back-end',
                    text:  'To have the API be publicly accessible it is fairly simple. For \'Debian\' based linux systems, you need to ' +
                        'allow the API port in and out of your device through the UFW (Uncomplicated Firewall).\n\n' +
                        'To do this you need to run this command'
                },
                    {
                        text: 'This command allows incoming traffic on this port. Allowing for the site to access the API from ' +
                            'any device anywhere.\n\n' +
                            'You will also need to port forward on your router. To do this, you will need to access the routers settings ' +
                            'find the port-forward tab, and add a new rule. Use your devices local ip address and the port you want to forward ' +
                            'for the API this will be \'3000\'.\n\n' +
                            'Typically most routers have a website hosted locally on this url:'
                    }],
                code: [
                    {code: 'sudo ufw allow 3000', language: 'bash'},
                    {code: 'https://192.168.0.1/', language: 'bash'},
                ]
            }}/>
            <TextArea isDarkMode={props.isDarkMode} data={{
                text: [
                    {
                        title: 'Back-end - over a domain',
                        text: 'To host the API publicly using a domain name you will need to configure a proxy through your web server. We recommend ' +
                            'using \'Nginx\' as it is simple and lightweight.\n\n' +
                            'This is a simple example of a http proxy configuration with Nginx:'
                }],
                code: [
                    {code: 'server {\n' +
                            '    server_name <api-domain-name>\n' +
                            '\n' +
                            '    location / {\n' +
                            '        proxy_pass http://127.0.0.1:3000;\n' +
                            '        proxy_http_version 1.1;\n' +
                            '        proxy_set_header Upgrade $http_upgrade;\n' +
                            '        proxy_set_header Connection "upgrade";\n' +
                            '        proxy_set_header Host $host;\n' +
                            '        proxy_cache_bypass $http_upgrade;\n' +
                            '\t}\n' +
                            '\n' +
                            '      # Node API endpoint\n' +
                            '    location /devices {\n' +
                            '        proxy_pass http://127.0.0.1:3000/devices;\n' +
                            '        proxy_http_version 1.1;\n' +
                            '        proxy_set_header Upgrade $http_upgrade;\n' +
                            '        proxy_set_header Connection "upgrade";\n' +
                            '        proxy_set_header Host $host;\n' +
                            '        proxy_cache_bypass $http_upgrade;\n' +
                            '    }\n' +
                            '}', language: 'bash'},
                ]
            }}/>
            <TextArea isDarkMode={props.isDarkMode} data={{
                text: [
                    {
                        title: 'Final Step',
                        text: 'If you want user authentication, Great no changes for you, the initial login is as follows: \n\n' +
                            'PASSWORD: \'password\' \n\n' +
                            'USERNAME: \'admin\' \n\n' +
                            'However if you don\'t care for user authentication, you need to go into the apps files and change one thing' +
                            'Go into this file:',
                    },
                    {
                        text: 'Once in the file all you need to do is change the word \'true\' to false',
                        img: Authentication
                    }],
                code: [{
                    language: 'bash',
                    code: 'metrics/emberMetrics/src/App.jsx',
                }]
            }}/>
        </>
    )
}