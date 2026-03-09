import DeviceSelection from "./DeviceSelection.jsx";
import PackageSelection from "./packageSelection.jsx";
import {useState} from "react";

export default function SoftwareManagement({devices}) {
    const [selectedManager, setSelectedManager] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState({
        name: ""
    });

    async function installPackage(){
        const packageManager = selectedManager;
        const device = selectedDevice;
    }

    return (
            <div className={"software-management"}>
                <header className={'section-header'}>
                    <h1>Software Management</h1>
                </header>
                <PackageSelection selectedManager={selectedManager}
                                  setSelectedManager={setSelectedManager} />
                <DeviceSelection devices={devices}
                                 selectedDevice={selectedDevice}
                                 setSelectedDevice={setSelectedDevice} />
            </div>
    )
}