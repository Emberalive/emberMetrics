import {useState} from "react";
import PackageManSelection from "./SoftwareManagement/packageManSelection.jsx";
import DeviceSelection from "./SoftwareManagement/DeviceSelection.jsx";
import SoftwareManagement from "./SoftwareManagement/SoftwareManagement.jsx";
import AdminNavigation from "./AdminNavigation.jsx";

export default function Admin({devices, handleNotification, hostIp, deviceType}) {
    const [adminView, setAdminView] = useState('software');
    return (
        <div className="admin__wrapper">
            <section className={'admin'}>
                <header className={'section-header'}>
                    <h1>Administration</h1>
                </header>
                <AdminNavigation adminView={adminView} setAdminView={setAdminView}/>
                {adminView === 'software' && <SoftwareManagement devices={devices} adminView={adminView}
                                                                 handleNotification={handleNotification}
                                                                 hostIp={hostIp}
                                                                 deviceType={deviceType}/>}
            </section>
        </div>
    )
}