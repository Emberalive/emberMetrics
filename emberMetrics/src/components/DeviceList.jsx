import {useState} from "react";

export default function DeviceList (props) {
    let devicesList;
    const [isEdit, setEdit] = useState(false);
    if (props.devices) {
        devicesList = props.devices.map((device) => {
            if (props.editDevice === device) {
                return (
                    <form onSubmit={props.submitDevice} className="device-management__form" style={{width:'100%'}}>
                        <div className={"device-management__form-element"}>
                            <label>Device Name:</label>
                            <input name={'deviceName'} type={'text'} placeholder={'Device Name'} value={device.name} onChange={(e) =>         props.setEditDevice(prev => ({ ...prev, name: e.target.value }))}/>
                    </div>
                    <div className={"device-management__form-element"}>
                        <label>Device IP Address:</label>
                        <input name={'ipAddress'} type={'text'} placeholder={'My Server'} value={props.editDevice.ip} onChange={(e => props.setEditDevice(prev=> ({...prev,ip: e.target.value })))}/>
                    </div>

                    <div className={"edit-device__form-buttons"}>
                        <button className="general-button" style={{fontSize: "20px", alignSelf: "flex-end"}}>Save</button>
                        <button className="general-button" style={{fontSize: "20px", alignSelf: "flex-end", backgroundColor: 'red'}} onClick={(e) => {
                            e.preventDefault()
                            props.setEditDevice()
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
                            props.setEditDevice(device);
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