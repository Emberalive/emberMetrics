import {useState} from "react";
import PortSelection from "./PortSelection.jsx";
import DeviceSelection from "../DeviceSelection.jsx";
import RuleSelection from "./RuleSelection.jsx";

export default function FirewallManagement({ devices, selectedDevice, setSelectedDevice,
                                               handleNotification, deviceType, hostIp }) {
    const [chosenPort, setChosenPort] = useState(0)
    const [chosenRule, setChosenRule] = useState('')

    function resetFields () {
        setSelectedDevice({
            name: ""
        })
        setChosenRule('')
        setChosenPort(0)
    }

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
                const resData = await response.json();
                if (resData.success) {
                    handleNotification('notice', `fireWall rule has been set successfully.`);
                    return
                }
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
        <div className={"firewall-management"}>
            <header className={'section-header'}>
                <h1>Firewall Management</h1>
            </header>
            <RuleSelection chosenRule={chosenRule} setChosenRule={setChosenRule}/>
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