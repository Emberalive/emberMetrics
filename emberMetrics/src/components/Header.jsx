export default function Header (props) {
    const metrics = props.metrics
    return (
        <>
        <header className="header">
            <div className="header__details">
                <h1>EmberMetrics</h1>
                {(metrics && props.activeView === "resources") && <div className="header__device-name">
                    <h3>Device:</h3>
                    <p style={{
                        borderBottom: '1px solid var(--border-color)',
                    }}    >{metrics.hostName}</p>
                </div>}
            </div>
            <div className={"header-navigation"}>
                <a     className={
                    localStorage.getItem('deviceType') === ""
                        ? "header-navigation__links disabled-button"
                        : props.activeView === "resources"
                            ? "header-navigation__links disabled-button"
                            : "header-navigation__links"
                } onClick={() => {
                    props.setActiveView("resources")
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
                } onClick={() => {
                    props.setActiveView("settings")
                    console.log("view set to settings")
                }}>
                    Settings
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
    )
}