import { useState } from "react";
import {useEffect} from "react";

export default function DeviceList (props) {
    let devicesList;
    const [editDevice, setEditID] = useState(null);
    const [deleteDeviceData, setDeleteDeviceData] = useState(null);

    useEffect(() => {
        console.log('deleteDevice: ', deleteDeviceData);
    }, [deleteDeviceData]);

    async function deleteDevice (device) {
        try {
            const deviceID = device.id
            const response = await fetch(`http://${props.deviceType === 'remote-access' ? props.hostIp : 'localhost'}:3000/devices`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({deviceID: deviceID}),
            })
            if (response.ok) {
                const index = props.devices.findIndex(device => device.id === deviceID);
                if (index !== -1) {
                    const updatedDevices = props.devices.filter((device) => device.id !== deviceID);
                    props.setDevices(updatedDevices);
                    props.handleNotification('notice', 'Successfully deleted devices');
                }
            } else {
                props.handleNotification('error', 'Failed to delete device');
            }
        } catch {
            props.handleNotification('error', 'Sorry there was an issue deleting this device');
        }
    }

    async function patchDevice (e) {
        e.preventDefault();
        try {
            const response = await fetch(`http://${props.deviceType === 'remote-access' ? props.hostIp : 'localhost'}:3000/devices`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({device: editDevice}),
            })
            if (response.ok) {
                const resData = response.json();
                if (resData) {
                    props.handleNotification('notice', 'Device has been updated')
                    const newDevices = props.devices.map(device => {
                        if (device.id === editDevice.id) {
                            return {...device, ip: editDevice.ip, name: editDevice.name };
                        } else {
                            return device;
                        }
                    })
                    if (newDevices.length === props.devices.length) {
                        props.setDevices(newDevices);
                    } else {
                        console.error('New devices is not the same length as devices')
                    }
                    setEditID(null);
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
        devicesList = props.devices.map(device => {
            if (editDevice && editDevice.id === device.id) {
                return (
                    <form onSubmit={patchDevice} className="device-management__form" style={{width:'100%'}}>
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
                            <button className="general-button" style={{fontSize: "20px", alignSelf: "flex-end", backgroundColor: 'red'}} onClick={(e) => {
                                e.preventDefault()
                                setEditID(null)
                            }}>Cancel</button>
                            <button className="general-button" style={{fontSize: "20px", alignSelf: "flex-end"}}>Save</button>


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
                            <button className="general-button" style={{fontSize: "20px", backgroundColor: 'DarkRed'}} onClick={(e) => {
                                console.log('[Client - deleteDevice] setting deleteDevice data to show check screen')
                                setDeleteDeviceData(device);
                            }}>Delete</button>
                            <button className="general-button" style={{fontSize: "20px"}} onClick={() => {
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
                        <button className={'general-button'} style={{backgroundColor: 'darkRed'}} onClick={(e) => {
                            e.preventDefault()
                            deleteDevice(deleteDeviceData)
                            setDeleteDeviceData(null)
                        }}>Yes</button>
                        <button className={'general-button'} onClick={() => {
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