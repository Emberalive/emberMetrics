import * as rangeCheck from "range_check";

export default function AddDevice(props) {
    async function submit(e) {
        e.preventDefault()
        const ip = e.target.ipAddress.value
        const name = e.target.deviceName.value
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
        try {
            const response = await fetch(`http://192.168.0.67:3000/devices`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    device: {
                        name: name,
                        ip: ip,
                    }
                })
            })
            if (response.ok) {
                const resData = await response.json()
                if (resData.success) {
                    props.handleNotification("notice", `successfully added the device "${ip}"`)
                    console.log(`Adding the ${ip} device.`)
                    props.setDevices((prev) => {
                        return [
                            ...prev,
                            {
                                ip: ip,
                                name: name,
                            },
                        ]
                    })
                }
            }
        } catch (e) {
            console.error('Error attempting to add a device to the api', e.message)
        }
        if (props.deviceType === "host") {
            try {
                const response = await fetch("http://localhost:3001/")
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.className = "device-management__blob-link";
                    link.href = url;
                    link.download = "remote-device.zip";  // must match your filename
                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    //in the case where the browser is slow
                    setTimeout(() => {
                        window.URL.revokeObjectURL(url);
                    }, 1000);

                    props.handleNotification("success", "Downloaded your remote device script")
                }
            } catch (e) {
                props.handleNotification("error", "couldn't download your remote device script")
                console.error("Could not download the device script", e.message)
            }
        }
        e.target.reset()
    }
    return (
        <form onSubmit={submit} className="device-management__form">
            <div className="device-management__form-container">
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
            </div>
        </form>
    )
}