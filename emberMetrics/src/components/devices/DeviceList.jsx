import { useState } from "react";
import {useEffect} from "react";

export default function DeviceList (props) {
    let devicesList;
    const devices = props.devices;
    const [editDevice, setEditID] = useState(null);
    const [deleteDeviceData, setDeleteDeviceData] = useState(null);

    useEffect(() => {
        console.log('deleteDevice: ', deleteDeviceData);
    }, [deleteDeviceData]);

    async function deleteDevice(device) {
        const deviceID = device.id;
        // Use latest user state to compute updated devices
        const updatedDevices = props.user.devices.filter(d => d.id !== deviceID);
        const userData = props.authentication? { ...props.user, devices: updatedDevices } : null

        try {
            // DELETE device from server
            const response = await fetch(`http://${props.deviceType === "remote-access" ? props.hostIp : "127.0.0.1"}:3000/devices`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deviceId: deviceID, user: userData, originalDevice: device }),
            });

            if (response.ok) {
                const resData = await response.json();
                if (resData.success && userData !== null) {
                    //if authentication is true (users exist) do this
                    props.handleNotification('notice', 'updated device successfully');
                    props.setUser(resData.updatedUser)
                    props.setDevices(resData.updatedUser.devices)
                    return
                } else if (resData.success && userData === null) {
                    //if no authentication (no user data) do this
                    props.handleNotification('notice', 'updated device successfully');
                    props.setDevices(updatedDevices)
                    return
                }
            }
            props.handleNotification('error', 'deleted device failed');
        } catch (e) {
            console.error("[Client - deleteDevice] error:", e);
            props.handleNotification('error', 'Error deleting device');
        }
    }

    async function patchDevice(e) {
        e.preventDefault();
        if (props.checkReservedDeviceProperties(editDevice)) return

        const originalDevice = devices.find(d => d.id === editDevice.id);
        // Build new devices array using latest user state
        const newDevices = props.user.devices.map(d =>
            d.id === editDevice.id ? { ...d, ip: editDevice.ip, name: editDevice.name } : d
        );

        //build new user object with the new devices
        const userData = props.authentication? { ...props.user, devices: newDevices } : null;

        try {
            // PATCH the device on the server
            const response = await fetch(`http://${props.deviceType === "remote-access" ? props.hostIp : "127.0.0.1"}:3000/devices`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    editedDevice: editDevice,
                    user: userData,
                    originalDevice: originalDevice,
                }),
            });

            if (response.ok) {
                const resData = await response.json();
                if (resData.success && userData !== null) {
                    //if authentication is true (users exist) do this
                    props.handleNotification('notice', 'updated device successfully');
                    props.setUser(resData.updatedUser)
                    props.setDevices(resData.updatedUser.devices)
                    return
                } else if (resData.success && userData === null) {
                    //if no authentication (no user data) do this
                    props.handleNotification('notice', 'updated device successfully');
                    props.setDevices(newDevices)
                    return
                }
            }
            props.handleNotification('error', 'Editing device failed');
        } catch (e) {
            props.handleNotification('error', 'Error deleting device');
        } finally {
            setEditID(null);
        }
    }

    if (devices) {
        devicesList = devices.map(device => {
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
                            <button className="general-button danger-button" type={'button'} style={{fontSize: "20px", alignSelf: "flex-end"}} onClick={(e) => {
                                e.preventDefault()
                                setEditID(null)
                            }}>Cancel</button>
                            <button className="general-button success-button" type={'submit'} style={{fontSize: "20px", alignSelf: "flex-end"}}>Save</button>
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
                        {(device.name.toLocaleLowerCase() !== "localhost" && device.name.toLocaleLowerCase() !== "host-device") &&<div style={{display: 'flex', flexDirection: 'row', gap: '10px', alignSelf: 'flex-end'}}>
                            <button className="general-button danger-button" onClick={() => {
                                console.log('[Client - deleteDevice] setting deleteDevice data to show check screen')
                                setDeleteDeviceData(device);
                            }}>Delete
                            </button>
                            <button className="general-button success-button" style={{fontSize: "20px"}}
                                    onClick={() => {
                                        setEditID(device);
                                    }}>Edit
                            </button>
                        </div>}
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
                backdropFilter: 'blur(2px)',
                top: 0
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
                {devices.length === 0 && <p style={{fontSize: "10px", fontWeight: "700", textAlign: "center"}}>You have no remote devices registered.</p>}
                {devicesList}
            </div>
        </>
    )
}