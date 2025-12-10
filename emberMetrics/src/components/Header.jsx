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
                <button className="settings-button general-button" onClick={() => {
                    props.setActiveView("settings")
                    props.activeView === "settings" ? props.setActiveView("resources") : props.setActiveView("settings")
                    console.log("view set to settings")
                }}>
                    {props.activeView === "settings" ? "Metrics" : "Settings"}
                </button>
                <button className="settings-button general-button" onClick={() => {
                    props.setActiveView("Devices")
                    props.activeView === "devices" ? props.setActiveView("resources") : props.setActiveView("devices")
                    console.log("view set to Devices")
                }}>
                    {props.activeView === "devices" ? "Metrics" : "devices"}

                </button>
            </div>
        </header>
    )
}