import DeviceSelection from "../DeviceSelection.jsx";
import PackageManSelection from "./ItemSelection.jsx";
import {useRef, useState} from "react";
import PackageSelection from "./PackageSelection.jsx";
import ItemSelection from "./ItemSelection.jsx";

export default function SoftwareManagement({devices, handleNotification, hostIp, deviceType, selectedDevice,
                                               setSelectedDevice, handleLogs, installation, viewPort}) {
    const [selectedManager, setSelectedManager] = useState(null);
    const [chosenPackage, setChosenPackage] = useState('');
    const [chosenOperation, setChosenOperation] = useState('');

    const packageManagers = [
        {name: "apt"},
        {name: "yum"},
        {name: "dnf"},
        {name: "pacman"},
        {name: "zypper"},
        {name: "emerge"},
        {name: "flatpak"},
    ];

    const softwareOperation = [
        {name: 'install'},
        {name: 'remove'},
        {name: 'check'},
    ]

    //These are all going to be used later on..... - Don't need to use them yet
    async function installPackage(){
        if (selectedManager === '' || selectedDevice.name === '' || chosenPackage === '') {
            handleNotification('error', 'Make sure all fields are selected')
            return
        }

        try {
            const response = await fetch(`http://${deviceType === 'remote-device' ? hostIp: '127.0.0.1'}:3000/admin/software`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    packageName: chosenPackage,
                    device: selectedDevice,
                    packageManager: selectedManager,
                    operation: chosenOperation,
                })
            })

            if (response.ok) {
                const installed = await handleLogs(response)
                if (installed) handleNotification('notice', `Successfully ${chosenOperation === 'install' ? 'installed' : 'removed'} ${chosenPackage}`);
                return
            }
            handleNotification('error', `was unable to ${chosenOperation} ${chosenPackage}`);
        } catch (e) {
            console.info(e)
            handleNotification('error', 'There was an error with the server, sorry')
        }
    }

    return (
            <div className={installation ? "software-management disabled-element" : "software-management"}>
                <header className={'section-header'}>
                    <h1>Software Management</h1>
                </header>
                <ItemSelection selectedItem={chosenOperation}
                               setSelectedItem={setChosenOperation}
                               items={softwareOperation}
                               title={'operation'} columns={3} viewPort={viewPort}/>
                <ItemSelection selectedItem={selectedManager}
                               setSelectedItem={setSelectedManager}
                               items={packageManagers}
                               title={'package manager'} columns={4} viewPort={viewPort}/>
                <DeviceSelection devices={devices}
                                 selectedDevice={selectedDevice}
                                 setSelectedDevice={setSelectedDevice}
                                 viewPort={viewPort}/>
                <PackageSelection setChosenPackage={setChosenPackage}  chosenPackage={chosenPackage}/>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <button className={'general-button success-button'} onClick={async () => {
                        await installPackage()
                    }}>Run Operation</button>
                    <button className={'general-button danger-button'} onClick={() => {
                        setSelectedDevice({name: ''})
                        setChosenPackage('')
                        setSelectedManager(null)
                    }}>Reset</button>
                </div>
            </div>
    )
}