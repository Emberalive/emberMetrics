import { useState } from "react";

export default function DeviceList (props) {
    let devicesList;
    const [editDevice, setEditDevice] = useState(null);

    async function patchDevice (e) {
        e.preventDefault();

        try {
            const response = await fetch(`http://${props.deviceType === 'host' ? 'localhost' : props.hostIp}:3000/devices`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    device: editDevice
                })
            })
            if (response.ok) {
                const resData = response.json();
                if (resData.success) {
                    props.handleNotification('notice', 'Device has been updated')
                } else {
                    props.handleNotification('error', 'Could not edit the device')
                }
            }
            } catch (e) {
            console.error('Error editing a patch', e.message);
            props.handleNotification('error', 'Could not edit your device, sorry');
        }
    }

    if (props.devices) {
        devicesList = props.devices.map((device) => {
            if (editDevice === device) {
                return (
                    <form onSubmit={patchDevice} className="device-management__form" style={{width:'100%'}}>
                        <div className={"device-management__form-element"}>
                            <label>Device Name:</label>
                            <input name={'deviceName'} type={'text'} placeholder={'Device Name'} value={device.name} onChange={(e) =>         setEditDevice(prev => ({ ...prev, name: e.target.value }))}/>
                    </div>
                    <div className={"device-management__form-element"}>
                        <label>Device IP Address:</label>
                        <input name={'ipAddress'} type={'text'} placeholder={'My Server'} value={editDevice.ip} onChange={(e => setEditDevice(prev=> ({...prev,ip: e.target.value })))}/>
                    </div>

                    <div className={"edit-device__form-buttons"}>
                        <button className="general-button" style={{fontSize: "20px", alignSelf: "flex-end"}}>Save</button>
                        <button className="general-button" style={{fontSize: "20px", alignSelf: "flex-end", backgroundColor: 'red'}} onClick={(e) => {
                            e.preventDefault()
                            setEditDevice()
                        }}>Cancel</button>
                    </div>

                </form>
            )
            } else {
                return (
                    <div className="device-container" key={device.ip}>
                        <p className="device-container__name">{device.name}</p>
                        <p className="device-container__ipAddr">
                            {device.ip}
                        </p>
                        <button className="general-button" style={{fontSize: "20px", alignSelf: "flex-end"}} onClick={() => {
                            setEditDevice(device);
                        }}>Edit</button>
                    </div>
                )
            }
        });
    }
    return (
        <div className="device-list__container">
            {props.devices.length === 0 && <p style={{fontSize: "10px", fontWeight: "700", textAlign: "center"}}>You have no remote devices registered.</p>}
            {devicesList}
        </div>
    )
}