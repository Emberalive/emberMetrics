import {useState} from "react";
import PortSelection from "./PortSelection.jsx";
import DeviceSelection from "../DeviceSelection.jsx";
import RuleSelection from "./RuleSelection.jsx";

export default function FirewallManagement({ devices, selectedDevice, setSelectedDevice }) {
    const [chosenPort, setChosenPort] = useState(0)
    const [chosenRule, setChosenRule] = useState('')

    async function setFireWallRule(port, operation, device) {
        //operation is allow or deny for the port | and well port is the port
    }

    return (
        <div className={"firewall-management"}>
            <header className={'section-header'}>
                <h1>Firewall Management</h1>
            </header>
            <PortSelection chosenPort={chosenPort} setChosenPort={setChosenPort}/>
            <RuleSelection chosenRule={chosenRule} setChosenRule={setChosenRule}/>
            <DeviceSelection devices={devices}
                             selectedDevice={selectedDevice}
                             setSelectedDevice={setSelectedDevice} />
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px'}}>
                <button className={'general-button success-button'} onClick={async () => {
                    await setFireWallRule()
                }}>Create Rule</button>
                <button className={'general-button danger-button'} onClick={() => {
                    setSelectedDevice({name: ''})
                    setChosenPort(0)
                    setChosenRule('')
                }}>Reset</button>
            </div>
        </div>
        )
}