import AddDevice from "./AddDevice.jsx";
import DeviceList from "./DeviceList.jsx";

export default function DeviceManagement (props) {
    return (
        <>
            <div className="device-management__wrapper">
                <section className="device-management__container">
                    <header className="device-management__header">
                        <h1>Device Management</h1>
                    </header>
                    <AddDevice submitDevice={props.submitDevice} />
                    <div className="device-management__header">
                        <h1>Remote Devices</h1>
                    </div>
                    <DeviceList devices={props.devices} editDevice={props.editDevice} setEditDevice={props.setEditDevice}/>
                </section>
            </div>

        </>
    )
}