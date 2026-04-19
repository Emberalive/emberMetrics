import {useState} from "react";
import YouSure from "../shared/YouSure.jsx";
import * as rangeCheck from "range_check";
import {nanoid} from "nanoid";

export default function GlobalDevices({allDevices, user, setUser, handleNotification, deviceType, hostIp, setAllDevices, checkReservedDeviceProperties}) {
    const [isEditing, setIsEditing] = useState(false);
    const [deleteDevice, setDeleteDevice] = useState(false);

    async function submitDevice(e) {
        e.preventDefault()
        const ip = e.target.ipAddress.value
        const name = e.target.deviceName.value
        //----------------------------validating data-----------------------------------------------//
        //this only allows the ip[ address to be public ipv4 and valid ip addresses to be created  || (rangeCheck.isPrivateIP(ip))
        if ((!rangeCheck.isIP(ip)) || (rangeCheck.version(ip) !== 4)) {
            console.log("Please enter a valid public and IPv4 address")
            handleNotification("error", "Please enter a valid public and IPv4 address")
            return
        }
        if (!name) {
            handleNotification("error", "Please enter a name for your device")
            return
        }
        const newDevice = {
            name: name,
            ip: ip,
            id: nanoid()
        }

        if (checkReservedDeviceProperties(newDevice)) return

        try {
            const sessionId = localStorage.getItem('sessionId');
            if (!sessionId) {
                handleNotification('notice', 'Your session has ran out, please refresh the page');
            }
            // requesting to create a device to the main device.json
            const response = await fetch(`https://metrics-api.emberalive.com/admin/createDevice`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'x-session-id': sessionId,
                },
                body: JSON.stringify({
                    device: newDevice,
                    admin: user,
                })
            })
            const resData = await response.json();
            if (response.ok) {
                if (resData.success) {
                    handleNotification('notice', `Created device: ${newDevice.name} successfully`);
                    const updatedDevices = [...allDevices, newDevice]
                    setAllDevices(updatedDevices);
                    return
                }
            }
            if (resData.reason === 'device already exists') {
                return handleNotification('error', 'A device already has this ip address')
            }
            handleNotification("error", "Creating device failed")
        } catch (e) {
            console.log('Error', e.message)
            handleNotification("error", "device was not created, server error")
        } finally {
            e.target.reset()
        }
    }

    async function onSubmit() {
        const sessionId = localStorage.getItem("sessionId");
        const response = await fetch(`https://metrics-api.emberalive.com/admin/globalDevice`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-session-id': sessionId,
            },
            body: JSON.stringify({
                device: deleteDevice,
                admin: user
            })
        })
        if (!response.ok) {
            const updatedDevices = user.devices.filter(d => d.id !== deleteDevice.id)
            setUser((prev) => {
                return{
                    ...prev,
                    devices: updatedDevices
                }
            })
            handleNotification('error', `Failed to delete the device ${deleteDevice.name} globally`);
        } else {
            const updateDevices = allDevices.filter(device => device.id !== deleteDevice.id);
            setAllDevices(updateDevices)
            handleNotification('success', `Successfully deleted device ${deleteDevice.name} globally`);
        }
        setIsEditing(false);
        setDeleteDevice(false);
    }

    const deviceList = allDevices.map((device) => {
        return (
            <div key={device.id} className={"admin__devices-list__item"}>
                <label>{device.name}</label>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    gap: '15px',
                }}>
                    <p>{device.ip}</p>
                    {isEditing && <button className={'danger-button general-button'} style={{
                        fontSize: '16px',
                        padding: '10px 15px 10px 15px'
                    }} onClick={() => {
                        setDeleteDevice(device);
                    }}>x</button>}
                </div>
            </div>
        )
    })

    return (
        <div className="admin__devices">
            <header className="section-header">
                <h1>Create Device</h1>
            </header>
            <form onSubmit={submitDevice} className="device-management__form">
                <div className={"device-management__form-element"}>
                    <label>Remote Device IP Address</label>
                    <input name={"ipAddress"} type="text" placeholder={"203.0.113.0"} ></input>
                </div>
                <p className="form__input-note">
                    Please make sure that you enter the <b>PUBLIC</b> IP address of your remote device
                </p>
                <div className={"device-management__form-element"}>
                    <label>Remote Device Name</label>
                    <input name={"deviceName"} type="text" placeholder={"My Server"} ></input>
                </div>
                <button className="general-button success-button" style={{fontSize: "20px", marginTop: "10px"}} type="submit">Create</button>
            </form>
            <header className="section-header">
                <h1>All Devices</h1>
            </header>
            <div className="admin__devices-list">
                {deviceList}
            </div>
            <button className={'general-button success-button'} onClick={() => {
                setIsEditing(prev => !prev);
            }} style={{
                marginTop: '10px',
                alignSelf: 'flex-end'
            }}>{isEditing ? 'Save' : 'Edit'}</button>
            {deleteDevice && <YouSure confirmFunction={() => onSubmit()} cancelFunction={() => setIsEditing(false)} message={'Are you sure you want to delete: '} messageHighlight={deleteDevice.name}/>}
        </div>
    )
}