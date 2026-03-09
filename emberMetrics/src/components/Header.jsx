import {createRef} from "react";

export default function Header (props) {
    const metrics = props.metrics


    function changeRemoteDevice(ip) {
        props.setSelectedDevice(ip)
        console.log("[APP_METRICS] Change remote device: ", ip)
        props.handleNotification("notice", `changed Remote Device to:\n ${ip}`)
        props.setMetrics(null)
        props.setTimeMetrics([])
    }

    let deviceButtonList
    if (props.devices){
        deviceButtonList = props.devices.map((device) => {
            return(<button key={device.id} className={props.selectedDevice === device.ip ?"general-button disabled-button": "general-button"} onClick={() => {
                changeRemoteDevice(device.ip)
                props.setMetrics(null)
            }} style={{
                minWidth: "fit-content",
                maxWidth: "fit-content",
            }}>{device.name}</button>)
        })
    }

    const groupsRef = createRef()
    const handleWheel = (e) => {
        if (groupsRef.current) {
            e.preventDefault()
            groupsRef.current.scrollLeft += e.deltaY;
        }
    }

    return (
        <>
        <header style={{display: 'flex', flexDirection: 'row'}} className={props.activeView === 'fullScreen' ? "display-none" : 'header'}>
            {((props.authentication === false && props.isLoggedIn === false) || props.isLoggedIn === true) &&
                <>
                <img src={props.logoImage} alt="ember metrics logo" />
            {props.viewPort > 1100 && <h1>Ember Metrics</h1>}
            <header className="header-details__wrapper">
                    <div className="header__details">
                        {(metrics && props.activeView === "resources") && <div className="header__device-name">
                            <h3>Device:</h3>
                            <p style={{
                                borderBottom: '1px solid var(--border-color)',
                            }}>{metrics.hostName}</p>
                        </div>}
                    </div>
                    <div className={"header-navigation"}>
                        <a className={
                            localStorage.getItem('deviceType') === ""
                                ? "header-navigation__links disabled-button"
                                : props.activeView === "resources"
                                    ? "header-navigation__links disabled-button"
                                    : "header-navigation__links"
                        } onClick={() => {
                            props.setActiveView("resources");
                            console.log("view set to Metrics")
                        }}>
                            Metrics
                        </a>
                        <a className={
                            localStorage.getItem('deviceType') === ""
                                ? "header-navigation__links disabled-button"
                                : props.activeView === "settings"
                                    ? "header-navigation__links disabled-button"
                                    : "header-navigation__links"
                        } onClick={(e) => {
                            props.setActiveView("settings")
                            console.log("view set to Settings")
                        }}>
                            Settings
                        </a>
                        { props.authentication && <a className={
                            localStorage.getItem('deviceType') === ""
                                ? "header-navigation__links disabled-button"
                                : props.activeView === "profile"
                                    ? "header-navigation__links disabled-button"
                                    : "header-navigation__links"
                        } onClick={() => {
                            props.setActiveView("profile")
                            console.log("view set to profile")
                        }}>
                            Profile
                        </a>}
                        <a className={
                            localStorage.getItem('deviceType') === ""
                                ? "header-navigation__links disabled-button"
                                : props.activeView === "admin"
                                    ? "header-navigation__links disabled-button"
                                    : "header-navigation__links"
                        } onClick={() => {
                            props.setActiveView("admin")
                            console.log("view set to Admin")
                        }}>
                            Administration
                        </a>
                        <a className={
                            localStorage.getItem('deviceType') === ""
                                ? "header-navigation__links__end disabled-button"
                                : props.activeView === "devices"
                                    ? "header-navigation__links__end disabled-button"
                                    : "header-navigation__links__end"
                        } onClick={() => {
                            props.setActiveView("devices")
                            console.log("view set to Devices")
                        }}>
                            Devices
                        </a>
                    </div>
            </header>
                </>
            }
            {(props.authentication === true && props.isLoggedIn === false) && <h1>Welcome to Ember Metrics</h1>}
        </header>
            {((props.activeView === "resources" && props.devices) && props.isLoggedIn === true) &&
                <>
                    <div className={"device-navigation__wrapper"} ref={groupsRef} onWheel={handleWheel}>
                        <div className={"device-navigation"}>
                            {deviceButtonList}
                        </div>
                    </div>
                </>
            }
        </>
    )
}