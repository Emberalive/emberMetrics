export default function DeviceList (props) {
    let devicesList;
    if (props.devices) {
        devicesList = props.devices.map((device) => {
            return (
                <div className="device-container" key={device.ip}>
                    <p className="device-container__name">{device.name}</p>
                    <p className="device-container__ipAddr">
                        {device.ip}
                    </p>
                    <button className="general-button" style={{fontSize: "20px", alignSelf: "flex-end"}}>Edit</button>
                </div>
            )
        });
    }
    return (
        <div className="device-list__container">
            {props.devices.length === 0 && <p style={{fontSize: "10px", fontWeight: "700", textAlign: "center"}}>You have no remote devices registered.</p>}
            {devicesList}
        </div>
    )
}