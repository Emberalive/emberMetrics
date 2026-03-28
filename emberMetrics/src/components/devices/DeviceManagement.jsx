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
                    <AddDevice handleNotification={props.handleNotification}
                               devices={props.devices}
                               checkReservedDeviceProperties={props.checkReservedDeviceProperties}
                               deviceType={props.deviceType}
                               hostIp={props.hostIp}
                               setDevices={props.setDevices}
                               setUser={props.setUser}
                               user={props.user}/>
                    <div className="device-management__header">
                        <h1>Your Devices</h1>
                    </div>
                    <DeviceList submitDevice={props.submitDevice} devices={props.devices}
                                checkReservedDeviceProperties={props.checkReservedDeviceProperties}
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