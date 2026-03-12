import {useState} from "react";
import PortSelection from "./PortSelection.jsx";
import DeviceSelection from "../DeviceSelection.jsx";
import RuleSelection from "./RuleSelection.jsx";
import ItemSelection from "../SoftwareManagement/ItemSelection.jsx";

export default function FirewallManagement({ devices, selectedDevice, setSelectedDevice,
                                               handleNotification, deviceType,
                                               hostIp, handleLogs, installation, viewPort}) {
    const [chosenPort, setChosenPort] = useState(0)
    const [chosenRule, setChosenRule] = useState('')

    function resetFields () {
        setSelectedDevice({
            name: ""
        })
        setChosenRule('')
        setChosenPort(0)
    }

    const rules = [
        {name: 'allow'},
        {name: 'deny'},
        {name: 'default allow incoming'},
        {name: 'default deny incoming'},
        {name: 'default allow outgoing'},
        {name: 'default deny outgoing'},
    ];

    async function setFireWallRule(args) {
        try {
            const response = await fetch(`http://${deviceType === 'remote-device' ? hostIp : '127.0.0.1:3000/admin/fireWallRule'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(args)
            })

            if (response.ok) {
                const installed = await handleLogs(response)
                if (installed) handleNotification('notice', `Set the rule: ${chosenRule} ${(chosenRule === "allow" || chosenRule === "deny" ? `- ${chosenPort}`: '')} on the machine: ${selectedDevice.name}`);
                return
            }
            handleNotification('error', `fireWall rule failed.`);
        } catch (e) {
            handleNotification('error', 'Server error, sorry')
        }
    }


    async function chooseParams() {
        if (chosenRule || chosenRule === "allow" || chosenRule === "deny") {
            await setFireWallRule({
                device: selectedDevice,
                rule: chosenRule,
                chosenPort: chosenPort,
            });
            return
        } else if (chosenRule && chosenPort && selectedDevice) {
            await setFireWallRule({
                device: selectedDevice,
                rule: chosenRule,
        });
            return
        }
        handleNotification('error', 'Please select all fields');
    }

    return (
        <div className={installation? "firewall-management disabled-element" : "firewall-management"}>
            <header className={'section-header'}>
                <h1>Firewall Management</h1>
            </header>
            <ItemSelection selectedItem={chosenRule} setSelectedItem={setChosenRule}
                           items={rules} title={'rule'} columns={4} viewPort={viewPort}/>
            <PortSelection chosenPort={chosenPort}
                           setChosenPort={setChosenPort}
                           chosenRule={chosenRule}/>
            <DeviceSelection devices={devices}
                             selectedDevice={selectedDevice}
                             setSelectedDevice={setSelectedDevice} />
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px'}}>
                <button className={'general-button success-button'} onClick={async () => {
                    await chooseParams()
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