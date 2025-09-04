export default function GpuData (props) {
    const gpuData = props.metrics.gpuData;
    return (
        <section>
            <h1>GPU Data</h1>
            <div className="gpu" style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
                <p>Gpu Name:</p>
                <p>{`${gpuData.model}`}</p>
            </div>
        </section>
    )
}
// {
//     "model": "AMD Radeon Graphics",
//         "vendor": "AMD",
//         "bus": "Integrated",
//         "vram": "N/A",
//         "vramDynamic": true,
//         "memory": {
//         "used": "N/A",
//             "total": "N/A",
//             "free": "N/A",
//             "utilization": "N/A"
//     },
//     "utilization": "N/A",
//         "temp": "N/A",
//         "power": "N/A",
//         "clocks": {
//         "core": "N/A",
//             "memory": "N/A"
//     }
// }
// ]