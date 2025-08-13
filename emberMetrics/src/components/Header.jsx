export default function Header (props) {
    const metrics = props.metrics
    return (
        <header style={{
            border: "1px solid ",
            borderRadius: "10px",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        }}>
            <button>blaggghhhh</button>
            <h1>EmberMetrics</h1>
            {metrics && <h2>{metrics.hostName}</h2>}
            <button>blaggghhhh</button>
        </header>
    )
}