export default function MemoryData(props) {
    const memoryUsage = props.metrics.memoryUsage
    return (
        <section className="memory-info">
            <div>
                {props.viewPort >= 800 ? <h2>Memory used - </h2> : <h3>Memory used - </h3>}
                {props.viewPort >= 800 ? <h3>{memoryUsage.usage}%</h3> : <h4>{memoryUsage.usage}%</h4>}
            </div>
            <div>
                {props.viewPort >= 800 ? <h2>Memory Available - </h2> : <h3>Memory Available - </h3>}
                {props.viewPort >= 800 ? <h3>{memoryUsage.available}%</h3> : <h4>{memoryUsage.available}%</h4>}
            </div>
        </section>
    )
}