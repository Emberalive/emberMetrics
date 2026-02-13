import TextArea from "../TextArea.jsx";

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

                    <div style={{height:'2px', width: core.usage + '%', backgroundColor: core.usage >= 40 ? core.usage >=70 ? 'red' : 'orange' : 'var(--tertiary)'}}></div>

                </li>
            );
        });
    }

    let cpuUsagePercents = []

    cpuUsagePercents = renderCpuUsage(cpuUsage.cores)

    return (
        <section className={"cpu-cores"}>
            <header className="section-header">
                <h1>CPU's</h1>
                <h2>Total {cpuUsage.total}%</h2>
            </header>
            {props.activeView !== 'fullScreen' && <TextArea data={{
                text: [{
                    text: 'This Module shows the cpu usage, It has the total usage of all cores divided by the number of cores, so the value will never go above 100%.' +
                        '.\n\n' +
                        'the bar on each core shows the total usage of the core based on the width of the core container.'
                }],
                code: []
            }}/>}

            <ul>
                {cpuUsagePercents}
            </ul>
        </section>
    )
}