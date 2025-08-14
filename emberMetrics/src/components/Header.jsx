export default function Header (props) {
    const metrics = props.metrics
    return (
        <header className="header">
            <h1>EmberMetrics</h1>
            {metrics && <div>
                <h2>Device:</h2>
                <p>{metrics.hostName}</p>
            </div>}
            <button onClick={() => {
                props.setIsDarkMode(prevState => !prevState);
                props.toggleView()
            }}>{props.isDarkMode ? "Light Mode" : "Dark Mode"}</button>
        </header>
    )
}