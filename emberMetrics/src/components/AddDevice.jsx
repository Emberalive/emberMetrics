import {nanoid} from "nanoid";
import * as rangeCheck from "range_check";

export default function AddDevice(props) {

    async function submitDevice(e) {
        e.preventDefault()
        const ip = e.target.ipAddress.value
        const name = e.target.deviceName.value
        //----------------------------validating data-----------------------------------------------//
        //this only allows the ip[ address to be public ipv4 and valid ip addresses to be created  || (rangeCheck.isPrivateIP(ip))
        if ((!rangeCheck.isIP(ip)) || (rangeCheck.version(ip) !== 4)) {
            console.log("Please enter a valid public and IPv4 address")
            props.handleNotification("error", "Please enter a valid public and IPv4 address")
            return
        }
        if (!name) {
            props.handleNotification("error", "Please enter a name for your device")
            return
        }
        const newDevice = {
            name: name,
            ip: ip,
            id: nanoid()
        }

        const userData = {
            ...props.user,
            devices: [...props.user.devices, newDevice]
        }
        try {
            // requesting to create a device to the main device.json
            const response = await fetch(`http://${props.deviceType === "remote-access" ? props.hostIp : "127.0.0.1"}:3000/devices`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    device: newDevice,
                    user: userData,
                })
            })

            if (response.ok) {
                const resData = await response.json()
                if (resData.success) {
                    props.setUser(resData.updatedUser)
                    props.handleNotification("success", "Successfully added new device: ", newDevice.name)
                } else {
                    props.handleNotification("error", "device was not created, server error")
                }
            }

        } catch (e) {
            props.handleNotification("error", "device was not created, server error")
        } finally {
            e.target.reset()
        }
    }

    return (
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
    )
}