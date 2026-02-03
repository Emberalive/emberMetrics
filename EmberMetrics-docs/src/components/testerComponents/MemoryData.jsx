import TextArea from "../TextArea.jsx";

export default function MemoryData(props) {
    const memoryUsage = props.metrics.memoryUsage
    return (
        <section className="memory-info">
            <header className={'section-header'}>
                <h1>Memory Usage</h1>
            </header>
            {props.activeView !== 'fullScreen' && <TextArea data={{
                text: [{
                    text: 'This module shows the memory usage of the device\n\n' +
                        '- Memory used\n' +
                        '- Memory Available\n\n' +
                        'NOTE: This module will show the total memory in the system, but has not been implemented.'
                }],
                code: []
            }}/>}
            <div className="memory-info__content">
                <div>
                    <p className={'memory-info__content-title'} >Memory used</p>
                    <p>{memoryUsage.usage}%</p>
                </div>

                <div>
                    <p className={'memory-info__content-title'}>Memory Available</p>
                    <p>{memoryUsage.available}%</p>
                </div>
                <div className={'memory-bar'} style={{width: 'calc('+ memoryUsage.usage + '% + var(--element-padding))', backgroundColor: memoryUsage.usage >= 40 ? memoryUsage.usage >=70 ? 'red' : 'orange' : 'var(--tertiary)'}}>
                </div>
            </div>
        </section>
    )
}