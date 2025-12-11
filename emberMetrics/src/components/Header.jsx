export default function Header (props) {
    const metrics = props.metrics
    return (
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
            <div className={"header__buttons"}>
                <button className={props.activeView === "resources"? "general-button general-button__clicked": "general-button"} onClick={() => {
                    props.setActiveView("resources")
                    console.log("view set to Metrics")
                }}>
                    Metrics
                </button>
                <button className={props.activeView === "settings"? "general-button general-button__clicked": "general-button"} onClick={() => {
                    props.setActiveView("settings")
                    console.log("view set to settings")
                }}>
                    Settings
                </button>
                <button className={props.activeView === "devices"? "general-button general-button__clicked": "general-button"} onClick={() => {
                    props.setActiveView("devices")
                    console.log("view set to Devices")
                }}>
                    Devices
                </button>
            </div>
        </header>
    )
}