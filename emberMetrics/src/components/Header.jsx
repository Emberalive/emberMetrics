export default function Header (props) {
    const metrics = props.metrics
    return (
        <header className="header">
            <h1>EmberMetrics</h1>
            {(metrics && props.activeView === "resources") && <div>
                <h2>Device:</h2>
                <p style={{
                    borderBottom: '1px solid var(--border-color)',
                }}    >{metrics.hostName}</p>
            </div>}
            <button className="settings-button general-button" onClick={() => {
                props.setActiveView("settings")
                props.activeView === "settings" ? props.setActiveView("resources") : props.setActiveView("settings")
                console.log("view set to settings")
            }}>
                {props.activeView === "settings" ? "Metrics" : "Settings"}
            </button>

        </header>
    )
}