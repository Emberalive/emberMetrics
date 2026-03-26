import {useState} from "react";
import YouSure from "../shared/YouSure.jsx";

export default function GlobalDevices({allDevices, user, handleNotification, deviceType, hostIp, setAllDevices}) {
    const [isEditing, setIsEditing] = useState(false);
    const [deleteDevice, setDeleteDevice] = useState(false);

    async function onSubmit() {
        const sessionId = localStorage.getItem("sessionId");
        const response = await fetch(`http://${deviceType === 'remote-device' ? hostIp : '127.0.0.1'}:3000/admin/globalDevice`, {
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