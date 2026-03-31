export default function Graphics({metrics, timeMetrics}) {
const gpuMetrics = metrics.gpuData

    if (!gpuMetrics) return null

    return (
        <section>
            <header className={'section-header'} style={{justifyContent: 'space-between', maxWidth: '100%'}}>
                <h1>GPU Data</h1>
                <p>{`Temp: ${gpuMetrics.temp}`}</p>
            </header>
            <div className="graphics-static-data">
                <div className="graphic">
                    <div className={'graphics-entry'}>
                        <label>Fan Speed</label>
                        <p>{gpuMetrics.fanSpeed}</p>
                    </div>
                    <div className={'graphics-entry'}>
                        <label>Power Draw</label>
                        <p>{gpuMetrics.PowerDraw ? gpuMetrics.PowerDraw :'Not Found'}</p>
                    </div>
                    <div className={'graphics-entry'}>
                        <label>Power Cap</label>
                        <p>{gpuMetrics.powerCap}</p>
                    </div>
                </div>
                <div className="video-memory">
                    <div className={'graphics-entry'}>
                        <label>Total Memory</label>
                        <p>{gpuMetrics.util.mem.total}</p>
                    </div>
                    <div className={'graphics-entry'}>
                        <label>Used Memory</label>
                        <p>{gpuMetrics.util.mem.used}</p>
                    </div>
                </div>
            </div>
            <header className={'section-header'} style={{maxWidth: '100%'}}>
                <h1>Clocks</h1>
            </header>
            <div className="clock-speed">
                <div className={'graphics-entry'}>
                    <label>gfx Compute</label>
                    <p>{gpuMetrics.clocks.gfx}</p>
                </div>
                <div className={'graphics-entry'}>
                    <label>Memory</label>
                    <p>{gpuMetrics.clocks.mem}</p>
                </div>
            </div>
            <header className={'section-header'} style={{maxWidth: '100%'}}>
                <h1>Utilisation</h1>
            </header>
            <div className="gpu-utilisation">
                <div className={'graphics-entry'}>
                    <label>GPU</label>
                    <p>{gpuMetrics.util.gpu}</p>
                </div>
                <div className={'graphics-entry'}>
                    <label>Memory</label>
                    <p>{gpuMetrics.util.mem.percent}</p>
                </div>
            </div>
        </section>
    )
}