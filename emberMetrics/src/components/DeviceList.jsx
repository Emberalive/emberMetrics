import { useState } from "react";
import {useEffect} from "react";

export default function DeviceList (props) {
    let devicesList;
    const [editDevice, setEditID] = useState(null);
    const [deleteDeviceData, setDeleteDeviceData] = useState(null);

    useEffect(() => {
        console.log('deleteDevice: ', deleteDeviceData);
    }, [deleteDeviceData]);

    async function deleteDevice(device) {
        try {
            const deviceID = device.id;

            // DELETE device from server
            const response = await fetch(`http://${props.deviceType === 'remote-access' ? props.hostIp : '127.0.0.1'}:3000/devices`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deviceID }),
            });

            if (!response.ok) {
                props.handleNotification('error', 'Failed to delete device');
                return;
            }

            // Use latest user state to compute updated devices
            const updatedDevices = props.user.devices.filter(d => d.id !== deviceID);
            const userData = { ...props.user, devices: updatedDevices };

            // PATCH user with updated devices
            const patchResponse = await props.patchUser(userData);

            if (patchResponse.success) {
                // update user state after backend confirms
                props.setUser(patchResponse.updatedUser);
                props.handleNotification('notice', 'Successfully deleted device');
            } else {
                // rollback device if PATCH fails
                await fetch(`http://${props.deviceType === 'remote-access' ? props.hostIp : '127.0.0.1'}:3000/devices`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ device }),
                });
                props.handleNotification('error', 'Failed to update user; device restored');
            }

        } catch (e) {
            console.error("[Client - deleteDevice] error:", e);
            props.handleNotification('error', 'Error deleting device');
        }
    }

    async function patchDevice(e) {
        e.preventDefault();
            const originalDevice = props.user.devices.find(d => d.id === editDevice.id);

        try {
            // PATCH the device on the server
            const response = await fetch(`http://${props.deviceType === 'remote-access' ? props.hostIp : '127.0.0.1'}:3000/devices`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({device: editDevice}),
            });

            if (!response.ok) {
                props.handleNotification('error', 'Failed to edit device');
                return;
            }

            const resData = await response.json();

            if (!resData.success) {
                props.handleNotification('error', 'Device update failed on server');
                return;
            }
        } catch {
            props.handleNotification('notice', 'Failed to update device');
            return;
        }
            // Build new devices array using latest user state
            const newDevices = props.user.devices.map(d =>
                d.id === editDevice.id ? { ...d, ip: editDevice.ip, name: editDevice.name } : d
            );
            //build new user object with the new devices
            const userData = { ...props.user, devices: newDevices };

            //flag to see if the device rollback is needed
            let userPatchSucceeded = false;

            try {
                // PATCH user with updated devices
                const patchResponse = await props.patchUser(userData);

                if (patchResponse?.success) {
                    userPatchSucceeded = true;
                    props.setUser(patchResponse.updatedUser);
                    props.handleNotification('notice', 'Device has been updated');
                }
            } catch {
                props.handleNotification('error', 'Failed to update device on the user object');
            }

            if (!userPatchSucceeded) {
                // rollback device PATCH if user PATCH fails
                await fetch(`http://${props.deviceType === 'remote-access' ? props.hostIp : '127.0.0.1'}:3000/devices`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ device: originalDevice }),
                });
                props.handleNotification('error', 'Failed to update user; device rollback applied');
            }
        setEditID(null);
    }

    if (props.user.devices) {
        devicesList = props.user.devices.map(device => {
            if (editDevice && editDevice.id === device.id) {
                return (
                    <form onSubmit={patchDevice} className="device-management__form" style={{width:'100%'}} key={device.id}>
                        <div className={"device-management__form-element"}>
                            <label>Device Name:</label>
                            <input name={'deviceName'} type={'text'} placeholder={'Device Name'} value={editDevice.name}
                                   onChange={(e) => setEditID(prev => (
                                { ...prev, name: e.target.value }))}/>
                        </div>
                        <div className={"device-management__form-element"}>
                            <label>Device IP Address:</label>
                            <input name={'ipAddress'} type={'text'} placeholder={'My Server'} value={editDevice.ip}
                                   onChange={(e => setEditID(prev=> (
                                       {...prev,ip: e.target.value })))}/>
                        </div>

                        <div className={"edit-device__form-buttons"}>
                            <button className="general-button danger-button" style={{fontSize: "20px", alignSelf: "flex-end"}} onClick={(e) => {
                                e.preventDefault()
                                setEditID(null)
                            }}>Cancel</button>
                            <button className="general-button success-button" style={{fontSize: "20px", alignSelf: "flex-end"}}>Save</button>
                        </div>
                    </form>
            )
            } else {
                return (
                    <div className="device-container" key={device.id}>
                        <p className="device-container__name">{device.name}</p>
                        <p className="device-container__ipAddr">
                            {device.ip}
                        </p>
                        <div style={{display: 'flex', flexDirection: 'row', gap: '10px', alignSelf: 'flex-end'}}>
                            <button className="general-button" style={{fontSize: "20px", backgroundColor: 'DarkRed'}} onClick={() => {
                                console.log('[Client - deleteDevice] setting deleteDevice data to show check screen')
                                setDeleteDeviceData(device);
                            }}>Delete</button>
                            <button className="general-button success-button" style={{fontSize: "20px"}} onClick={() => {
                                setEditID(device);
                            }}>Edit</button>
                        </div>
                    </div>
                )
            }
        });
    }
    return (
        <>
            {deleteDeviceData && <div style={{
                height: '100%',
                width: '100%',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                backdropFilter: 'blur(2px)'
            }}>
                <section style={{height: '150px', width: '500px'}}>
                    <div style={{display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
                        <p style={{fontSize: 'var(--font-size)'}}>Do you want to delete</p>
                        <p style={{fontWeight: 700, color: 'var(--secondary)', fontSize: 'var(--font-size)'}}>{deleteDeviceData.name}</p>
                    </div>
                    <div style={{width: '100%', gap: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <button className={'general-button  danger-button'} onClick={(e) => {
                            e.preventDefault()
                            deleteDevice(deleteDeviceData)
                            setDeleteDeviceData(null)
                        }}>Yes</button>
                        <button className={'general-button success-button'} onClick={() => {
                            setDeleteDeviceData(null)
                        }}>No</button>
                    </div>
                </section>
            </div>}
            <div className="device-list__container">
                {props.devices.length === 0 && <p style={{fontSize: "10px", fontWeight: "700", textAlign: "center"}}>You have no remote devices registered.</p>}
                {devicesList}
            </div>
        </>
    )
}