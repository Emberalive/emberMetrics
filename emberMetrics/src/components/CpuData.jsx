export default function CpuData (props) {
    const cpuUsage = props.metrics.cpuUsage

    try {

        if (!cpuUsage || !Array.isArray(cpuUsage.cores)) {
            throw new Error('Invalid CPU Usage');
        }

        const cpuUsagePercents = cpuUsage.cores.map((core) => {
            return (
                <li style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid',
                    margin: '5px',
                }}>
                    <h1>Core - {core.no}</h1>
                    <h2>{core.usage}%</h2>
                </li>
            )
        })

        return (
            <section style={{

            }}>
                <h1>Total {cpuUsage.total}</h1>
                <ul>
                    {cpuUsagePercents}
                </ul>
            </section>
        )
    } catch (err) {
        console.error("[ CpuUsage ] - Error: " + err.message);
    }
}