import AddDevice from "./AddDevice.jsx";

export default function DeviceManagement (props) {
    return (
        <>
            <div className="device-management__wrapper">
                <div className="device-management__container">
                    <header className="device-management__header">
                        <h2>Device Management</h2>
                    </header>
                    <AddDevice handleNotification={props.handleNotification}/>
                    <div className="device-management__header">
                        <h3>Remote Devices</h3>
                    </div>
                    <p style={{fontSize: "10px", fontWeight: "700", textAlign: "center"}}>{props.devices ? "You have no remote devices registered." : ""}</p>
                </div>
            </div>

        </>
    )
}