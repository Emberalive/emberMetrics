export default function MemoryData(props) {
    const memoryUsage = props.metrics.memoryUsage
    return (
        <section className="memory-info">
            <div className="memory-info__content">
                <div>
                    <p className={'memory-info__content-title'} >Memory used</p>
                    <p>{memoryUsage.usage}%</p>
                </div>
                <div>
                    <p className={'memory-info__content-title'}>Memory Available</p>
                    <p>{memoryUsage.available}%</p>
                </div>
                <div className={'memory-bar'} style={{width: 'calc('+ memoryUsage.usage + '% + var(--element-padding))', backgroundColor: memoryUsage.usage >= 40 ? memoryUsage.usage >=70 ? 'red' : 'orange' : 'var(--secondary)'}}>
                </div>
            </div>
        </section>
    )
}