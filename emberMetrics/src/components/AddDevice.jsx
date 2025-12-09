import * as rangeCheck from "range_check";

export default function AddDevice(props) {
    function submit (e) {
        e.preventDefault()
        const ip = e.target.ipAddress.value
        //this only allows the ip[ address to be public ipv4 and valid ip addresses to be created
        if ( (!rangeCheck.isIP(ip)) || (rangeCheck.version(ip) !== 4) || (rangeCheck.isPrivateIP(ip)) ) {
            console.log("Please enter a valid public and IPv4 address")
            props.handleNotification("error", "Please enter a valid public and IPv4 address")
            return
        }
        props.handleNotification("notice", `successfully added the device "${ip}"`)
        console.log(`Adding the ${ip} device.`)
    }
    return (
        <form onSubmit={submit} className="device-management__form">
            <div className="device-management__form-container">
                    <div className={"device-management__form-element"}>
                        <label>Device IP Address</label>
                        <input name={"ipAddress"} type="text" placeholder={"203.0.113.0"} ></input>
                    </div>
                    <p className="form__input-note">
                        Please make sure that you enter the <b>PUBLIC</b> IP address of your remote device
                    </p>
                    <button className="general-button" style={{fontSize: "20px"}} type="submit">Create</button>
            </div>
        </form>
    )
}