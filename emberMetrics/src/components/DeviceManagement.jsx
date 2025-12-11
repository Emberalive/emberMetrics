import AddDevice from "./AddDevice.jsx";

export default function DeviceManagement (props) {
    const devicesList = props.devices.map((device) => {
        return (
            <div className="device-container" key={device.ip}>
                <p className="device-container__name">{device.name}</p>
                <p className="device-container__ipAddr">
                    {device.ip}
                </p>
                <button className="general-button" style={{fontSize : "20px", alignSelf: "flex-end"}}>Edit</button>
                <div className="device-container__seperator"></div>
            </div>
        )
    });
    return (
        <>
            <div className="device-management__wrapper">
                <div className="device-management__container">
                    <header className="device-management__header">
                        <h2>Device Management</h2>
                    </header>
                    <AddDevice handleNotification={props.handleNotification} setDevices={props.setDevices}/>
                    <div className="device-management__header">
                        <h3>Remote Devices</h3>
                    </div>
                    {props.devices.length === 0 && <p style={{fontSize: "10px", fontWeight: "700", textAlign: "center"}}>You have no remote devices
                        registered.</p>}
                    {devicesList}
                </div>
            </div>

        </>
    )
}