
export default function AddDevice(props) {

    return (
        <form onSubmit={props.submitDevice} className="device-management__form">
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
            <button className="general-button" style={{fontSize: "20px", marginTop: "10px"}} type="submit">Create</button>
        </form>
    )
}