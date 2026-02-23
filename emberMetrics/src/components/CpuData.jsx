import {useEffect, useState} from "react";
import {LineChart, lineElementClasses, markElementClasses} from "@mui/x-charts/LineChart";
import {axisClasses} from "@mui/x-charts/ChartsAxis";
import {legendClasses} from "@mui/x-charts/ChartsLegend";
import {chartsGridClasses} from "@mui/x-charts/ChartsGrid";
import {ChartsWrapper} from "@mui/x-charts";

export default function CpuData (props) {
    const cpuUsage = props.metrics.cpuUsage

    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        if (!props.timeMetrics?.length || !props.isGraph) return;

        const coreCount = props.timeMetrics[0].cpuUsage.cores.length;

        const datasets = Array.from({length: coreCount}, (_, i) =>
            props.timeMetrics.map((snapshot, timeIndex) => (
                {
                    x: timeIndex,
                    usage: parseFloat(snapshot.cpuUsage.cores[i].usage)
                }
            ))
        )
        console.info(JSON.stringify(datasets, null, 2));
        setGraphData(datasets)
    }, [props.timeMetrics])

    let renderGraphs = []
    if (props.isGraph) {
        renderGraphs = graphData.map((graph, index) => {
            return (
                <div style={{flex: 1, overflow: "visible"}} >
                    <LineChart
                        dataset={graph}
                        xAxis={[{
                            dataKey: 'x',
                            label: `Seconds`,
                            scaleType: "linear",
                            tickNumber: graph.length,
                            tickLabelInterval: () => true,  // force all tick labels to render
                        }]}
                        yAxis={[{
                            label: 'Core Usage (%) ',
                        }]}
                        series={[
                            {
                                dataKey: 'usage',
                                label: `core - ${cpuUsage.cores[index].no}`,
                                color: 'var(--secondary)',
                            }
                        ]}
                        grid={{ stroke: '#333', strokeWidth: 0.5, vertical: true, horizontal: true }}
                        height={200}
                        sx={(theme) => ({
                            // ===== Line styling =====
                            [`.${lineElementClasses.root}`]: {
                                // stroke: props.cpuColours[index],
                                strokeWidth: 2,
                            },

                            // ===== Point markers =====
                            [`.${markElementClasses.root}`]: {
                                fill: 'var(--tertiary)',
                                stroke: 'aliceblue',
                                strokeWidth: 1,
                                r: 3,
                            },

                            // ===== Axis styling =====
                            [`.${axisClasses.root}`]: {
                                [`.${axisClasses.line}`]: {
                                    stroke: '#888',
                                    strokeWidth: 2,
                                },
                                [`.${axisClasses.tick}`]: {
                                    stroke: '#888',
                                },
                                [`.${axisClasses.tickLabel}`]: {
                                    fill: 'aliceblue',  // This was empty before — tick labels had no color!
                                    fontSize: 11,
                                },
                                [`.${axisClasses.label}`]: {
                                    fill: 'aliceblue',
                                    fontSize: 12,
                                },
                            },

                            [`.${legendClasses.label}`]: {
                                color: 'aliceblue',   // text color
                                fontSize: 14,
                                fontWeight: 600,
                            },

                            // ===== Grid styling =====
                            [`.${chartsGridClasses.line}`]: {
                                stroke: 'var(--neutral)',
                                strokeWidth: 2,
                            },

                            // ===== Container styling =====
                            backgroundColor: '#121212',
                            borderRadius: 8,
                        })}
                    />
                </div>
            )
        })
    }

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

    try {
        let cpuUsagePercents = []

        cpuUsagePercents = renderCpuUsage(cpuUsage.cores)

        return (
            <section className={"cpu-cores"}>
                <header className="section-header">
                    <h1>CPU's</h1>
                    <h2>Total {cpuUsage.total}%</h2>
                </header>
                { props.isGraph ?
                    <div className={'cpu-cores__graph-container'}>
                        {renderGraphs}
                    </div>
                    :
                    <ul>
                        {cpuUsagePercents}
                    </ul>
                }
            </section>
        )
    } catch (err) {
        console.error("[ CpuUsage ] - Error: " + err.message);
    }
}