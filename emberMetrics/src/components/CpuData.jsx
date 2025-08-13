import {useState} from "react";

export default function CpuData (props) {
    const cpuUsage = props.metrics.cpuUsage

    let first = []
    let second = []

    const [isLong, setIsLong] = useState(false)

    function renderCpuUsage(cpuList) {
        return cpuList.map((core) => {
            return (
                <li
                    key={core.no} // always add a key in map!
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid",
                        margin: "5px",
                    }}
                >
                    <h1>Core - {core.no}</h1>
                    <h2>{core.usage}%</h2>
                </li>
            );
        });
    }


    try {
        let cpuUsagePercents = []
        if (!cpuUsage || !Array.isArray(cpuUsage.cores)) {
            throw new Error('Invalid CPU Usage');
        }

        if (cpuUsage.cores.length > 7) {
            setIsLong(prev => !prev );
            const firstHalf = cpuUsage.cores.slice(0, 6);
            const secondHalf = cpuUsage.cores.slice(6);
            first =  renderCpuUsage(firstHalf);
            second = renderCpuUsage(secondHalf);

        } else {
            cpuUsagePercents = renderCpuUsage(cpuUsage.cores)
        }

        return (
            <section style={{}}>
                <h1>Total {cpuUsage.total}</h1>
                {isLong ? <>
                        <ul>
                            {first}
                        </ul>
                        <ul>
                            {second}
                        </ul>

                    </>
                    : <ul>
                    {cpuUsagePercents}
                </ul>}
            </section>
        )
    } catch (err) {
        console.error("[ CpuUsage ] - Error: " + err.message);
    }
}