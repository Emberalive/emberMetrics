import AddDevice from "./AddDevice.jsx";
import DeviceList from "./DeviceList.jsx";

export default function DeviceManagement (props) {
    function checkReservedDeviceProperties(device) {
        console.log('checking for a reserved device property')
        const reservedProperties = ['localhost', 'host-device', '127.0.0.1'];
        const isReserved = reservedProperties.some(property => {
            return (device.ip.toLocaleLowerCase() === property || device.name.toLocaleLowerCase() === property);
        })
        if (isReserved) {
            console.log('device has a reserved property')
            props.handleNotification('error', 'Device used a reserved name or IP: \'localhost\', \'127.0.0.1\', \'host-device\'')
            return true
        }
        console.log('device does not have a reserved property')
        return false
    }

    return (
        <>
            <div className="device-management__wrapper">
                <section className="device-management__container">
                    <header className="device-management__header">
                        <h1>Device Management</h1>
                    </header>
                    <AddDevice handleNotification={props.handleNotification}
                               devices={props.devices}
                               checkReservedDeviceProperties={checkReservedDeviceProperties}
                               deviceType={props.deviceType}
                               hostIp={props.hostIp}
                               setDevices={props.setDevices}
                               setUser={props.setUser}
                               user={props.user}/>
                    <div className="device-management__header">
                        <h1>Remote Devices</h1>
                    </div>
                    <DeviceList submitDevice={props.submitDevice} devices={props.devices}
                                checkReservedDeviceProperties={checkReservedDeviceProperties}
                                editDevice={props.editDevice}
                                setEditDevice={props.setEditDevice}
                                handleNotification={props.handleNotification}
                                setDevices={props.setDevices}
                                user={props.user}
                                setUser={props.setUser}/>
                </section>
            </div>

        </>
    )
}