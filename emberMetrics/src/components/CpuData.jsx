export default function CpuData (props) {
    const cpuUsage = props.metrics.cpuUsage

    function renderCpuUsage(cpuList) {
        return cpuList.map((core) => {
            return (
                <li style={{
                    listStyleType: 'none',
                    paddingLeft: '10px',
                    border: '1px solid black',
                    borderRadius: '10px',
                    display: 'flex',
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
            <section style={{}}>
                <h1>Total {cpuUsage.total.toFixed(2)}%</h1>

                <ul style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "10px",
                }}>
                    {cpuUsagePercents}
                </ul>
            </section>
        )
    } catch (err) {
        console.error("[ CpuUsage ] - Error: " + err.message);
    }
}