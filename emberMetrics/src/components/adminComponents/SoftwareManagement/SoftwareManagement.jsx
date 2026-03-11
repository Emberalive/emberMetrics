import DeviceSelection from "../DeviceSelection.jsx";
import PackageManSelection from "./ItemSelection.jsx";
import {useState} from "react";
import PackageSelection from "./PackageSelection.jsx";
import ItemSelection from "./ItemSelection.jsx";

export default function SoftwareManagement({devices, handleNotification, hostIp, deviceType, selectedDevice, setSelectedDevice}) {
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
    const [installation, setInstallation] = useState(false);
    const [subProcess, setSubProcess] = useState(null);

    async function installPackage(){
        const packageManager = selectedManager;
        const device = selectedDevice;
        const pkg = chosenPackage;

        console.info("Install package has started");

        if (!packageManager || !selectedManager || !selectedDevice) {
            handleNotification('error', 'Make sure all fields are selected')
        }

        try {
            console.info("attempting to call the host API");

            const response = await fetch(`http://${deviceType === 'remote-device' ? hostIp: '127.0.0.1'}:3000/admin/software`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    packageName: pkg,
                    device: device,
                    packageManager: packageManager,
                    operation: chosenOperation,
                })
            })

            if (response.ok) {
                const resData = await response.json();
                if (resData.success) {
                    handleNotification('notice', `${chosenPackage} is being installed on ${device.name}`)
                    setInstallation(true);
                    setSubProcess(resData.process);
                }
            }
        } catch (e) {
            console.info(e)
            handleNotification('error', 'There was an error with the server, sorry')
        }
    }

    return (
            <div className={"software-management"}>
                <header className={'section-header'}>
                    <h1>Software Management</h1>
                </header>
                <ItemSelection selectedItem={chosenOperation}
                               setSelectedItem={setChosenOperation}
                               items={softwareOperation} title={'operation'} />
                <ItemSelection selectedItem={selectedManager}
                               setSelectedItem={setSelectedManager}
                               items={packageManagers} title={'package manager'} />
                <DeviceSelection devices={devices}
                                 selectedDevice={selectedDevice}
                                 setSelectedDevice={setSelectedDevice} />
                <PackageSelection setChosenPackage={setChosenPackage}  chosenPackage={chosenPackage}/>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <button className={'general-button success-button'} onClick={async () => {
                        await installPackage()
                    }}>Install</button>
                    <button className={'general-button danger-button'} onClick={() => {
                        setSelectedDevice({name: ''})
                        setChosenPackage('')
                        setSelectedManager(null)
                    }}>Reset</button>
                </div>
            </div>
    )
}