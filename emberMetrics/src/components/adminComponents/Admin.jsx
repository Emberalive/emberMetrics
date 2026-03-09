import {useState} from "react";
import PackageSelection from "./SoftwareManagement/packageSelection.jsx";
import DeviceSelection from "./SoftwareManagement/DeviceSelection.jsx";
import SoftwareManagement from "./SoftwareManagement/SoftwareManagement.jsx";

export default function Admin({devices}) {
    return (
        <div className="admin__wrapper">
            <section className={'admin'}>
                <header className={'section-header'}>
                    <h1>Administration</h1>
                </header>
                <SoftwareManagement devices={devices} />
            </section>
        </div>
    )
}