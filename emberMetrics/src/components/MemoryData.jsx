export default function MemoryData(props) {
    const memoryUsage = props.metrics.memoryUsage
    return (
        <section className="memory-info">
            <div>
                <h2>Memory used - </h2>
                <h3>{memoryUsage.usage}</h3>
            </div>
            <div>
                <h2>Memory Available - </h2>
                <h3>{memoryUsage.available}</h3>
            </div>
        </section>
    )
}