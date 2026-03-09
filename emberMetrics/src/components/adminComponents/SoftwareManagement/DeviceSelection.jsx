export default function DeviceSelection({devices, selectedDevice, setSelectedDevice}) {
    if (!devices) return null

    const devicesList = devices.map(device => {
        return (
            <div  key={device.id} className={selectedDevice.name === device.name? "admin-selection__item disabled-selection" : 'admin-selection__item'}
                 onClick={() => setSelectedDevice(device)}>
                <p>{device.name}</p>
            </div>
        )
    })

    return (
        <div className={"admin-selection__container"}>
            <header>
                <p>Please select a device</p>
            </header>
            <div  className={"admin-selection__items"}>
                {devicesList}
            </div>
        </div>
    )
}