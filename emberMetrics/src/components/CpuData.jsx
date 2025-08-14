export default function CpuData (props) {
    const cpuUsage = props.metrics.cpuUsage

    function renderCpuUsage(cpuList) {
        return cpuList.map((core) => {
            return (
                <li style={{

                }}
                    key={core.no}>
                    <p>Core - {core.no}</p>
                    <p>{core.usage}%</p>
                </li>
            );
        });
    }

    try {
        let cpuUsagePercents = []

        cpuUsagePercents = renderCpuUsage(cpuUsage.cores)

        return (
            <section className={"cpu-cores"}>
                <header className="cpu-header">
                    <h1>CPU's</h1>
                    <h2>Total {cpuUsage.total.toFixed(2)}%</h2>
                </header>

                <ul style={{

                }}>
                    {cpuUsagePercents}
                </ul>
            </section>
        )
    } catch (err) {
        console.error("[ CpuUsage ] - Error: " + err.message);
    }
}