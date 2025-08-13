export default function MemoryData(props) {
    const memoryUsage = props.metrics.memoryUsage
    return (
        <section>
            <div style={{display: "flex",
                justifyContent: "space-between",
                border: "1px solid black",
                borderRadius: "10px",
                margin: "10px",
            }}>
                <h2>Memory used - </h2>
                <h3>{memoryUsage.usage}</h3>
            </div>
            <div style={{display: "flex",
                justifyContent: "space-between",
                border: "1px solid black",
                borderRadius: "10px",
                margin: "10px",
            }}>
                <h2>Memory Available - </h2>
                <h3>{memoryUsage.available}</h3>
            </div>
        </section>
    )
}