export default function CpuData (props) {
    const cpuUsage = props.metrics.cpuUsage

    function renderCpuUsage(cpuList) {
        return cpuList.map((core) => {
            return (
                <li
                    key={core.no}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <p>Core - {core.no}</p>
                        <p>{core.usage}%</p>
                    </div>

                    <div style={{height:'2px', width: core.usage + '%', backgroundColor: core.usage >= 40 ? core.usage >=70 ? 'red' : 'orange' : 'var(--secondary)'}}></div>

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

                <ul>
                    {cpuUsagePercents}
                </ul>
            </section>
        )
    } catch (err) {
        console.error("[ CpuUsage ] - Error: " + err.message);
    }
}