export default function GlobalDevices({allDevices}) {
    const deviceList = allDevices.map((device) => {
        return (
            <div key={device.id} className={"admin__devices-list__item"}>
                <label>{device.name}</label>
                <p>{device.ip}</p>
            </div>
        )
    })

    return (
        <div className="admin__devices">
            <header className="section-header">
                <h1>All Devices</h1>
            </header>
            <div className="admin__devices-list">
                {deviceList}
            </div>
        </div>
    )
}