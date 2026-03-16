import {useRef, useState} from "react";
import SoftwareManagement from "./SoftwareManagement/SoftwareManagement.jsx";
import AdminNavigation from "./AdminNavigation.jsx";
import FirewallManagement from "./firewallManagement/FirewallManagement.jsx";
import LogDisplay from "./LogDisplay.jsx";

export default function Admin({devices, handleNotification, hostIp, deviceType, viewPort}) {
    const [adminView, setAdminView] = useState('software');
    const [selectedDevice, setSelectedDevice] = useState({
        name: ""
    });
    const [installation, setInstallation] = useState(false);
    const [displayLogs, setDisplayLogs] = useState(false);
    const [logs, setLogs] = useState([]);
    const logDisplayRef = useRef(null);

    async function handleLogs(response) {
        try {
            if (!response || !response.body) return false;
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let isDone = false;
            setInstallation(prevState => !prevState);
            setDisplayLogs(prevState => !prevState);

            while(!isDone) {
                const {value, done} = await reader.read();
                isDone = done;

                if(value) {
                    const chunk = decoder.decode(value, {stream: true});

                    console.log("[ Client - Admin /handleLogs] chunk: ", chunk)
                    setLogs(prevLogs => [...prevLogs, chunk]);
                }
            }
            setInstallation(prevState => !prevState);
            console.log('[ Client - Admin /handleLogs] Log streaming finished');
            return true;
        } catch (e) {
            console.info('Error handling logs: ', e.message)
        }
    }

    return (
        <div className="admin__wrapper">
            <section className={'admin'}>
                <header className={'section-header'}>
                    <h1>Administration</h1>
                </header>
                <AdminNavigation adminView={adminView} setAdminView={setAdminView}/>
                {displayLogs && <LogDisplay setDisplayLogs={setDisplayLogs} logs={logs} setLogs={setLogs} logDisplayRef={logDisplayRef} viewPort={viewPort} />}
                {adminView === 'software' && <SoftwareManagement devices={devices} adminView={adminView}
                                                                 handleNotification={handleNotification}
                                                                 hostIp={hostIp}
                                                                 deviceType={deviceType}
                                                                 selectedDevice={selectedDevice}
                                                                 handleLogs={handleLogs}
                                                                 setSelectedDevice={setSelectedDevice}
                                                                 installation={installation}
                                                                 setInstallation={setInstallation} viewPort={viewPort}/>}
                {adminView === 'firewall' && <FirewallManagement devices={devices} adminView={adminView}
                                                                 handleNotification={handleNotification}
                                                                 hostIp={hostIp}
                                                                 deviceType={deviceType}
                                                                 selectedDevice={selectedDevice}
                                                                 setSelectedDevice={setSelectedDevice}
                                                                 handleLogs={handleLogs}
                                                                 installation={installation}
                                                                 setInstallation={setInstallation} viewPort={viewPort}/>}
            </section>
        </div>
    )
}