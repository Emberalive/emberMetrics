import {useEffect, useRef, useState} from "react";
import {LineChart, lineElementClasses, markElementClasses} from "@mui/x-charts/LineChart";
import {axisClasses} from "@mui/x-charts/ChartsAxis";
import {legendClasses} from "@mui/x-charts/ChartsLegend";
import {chartsGridClasses} from "@mui/x-charts/ChartsGrid";

export default function CpuData (props) {
    const cpuUsage = props.metrics.cpuUsage

    const storageValue = localStorage.getItem("cpuChaosGraph");

    const [isChaosGraph, setIsChaosGraph] = useState(() => {
        if (!storageValue) {
            return false;
        } else {
            return storageValue === "true";
        }
    })

    const hasMounted = useRef(false);

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }
        localStorage.setItem("cpuChaosGraph", isChaosGraph.toString())
    }, [isChaosGraph]);


    const cpuSeries = props.metrics.cpuUsage.cores.map((core, i) => {
        return {
            dataKey: `core: ${core.no}`,
            label: `core: ${core.no}`,
            color: props.themes[i].tertiary,
        }
    })
    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        if (!props.timeMetrics?.length) return;

        let datasets

        if (isChaosGraph) {
            datasets = props.timeMetrics.map((snapshot, timeIndex) => {
                const entry = {x: timeIndex * (props.metricInterval/1000)}
                snapshot.cpuUsage.cores.forEach((core) => {
                    entry[`core: ${core.no}`] = parseFloat(core.usage)
                })
                return entry;
            })
        } else {
            const coreCount = props.timeMetrics[0].cpuUsage.cores.length;
            datasets = Array.from({length: coreCount}, (_, i) =>
                props.timeMetrics.map((snapshot, timeIndex) => (
                    {
                        x: timeIndex * (props.metricInterval/1000),
                        usage: parseFloat(snapshot.cpuUsage.cores[i].usage)
                    }
                ))
            )
        }
        setGraphData(datasets)
    }, [props.timeMetrics])

    let renderGraphs = []
    let renderChaosGraph;
    if (props.isGraph) {
        if (!isChaosGraph) {
            renderGraphs = graphData.map((graph, index) => {
                return (
                    <div style={{flex: 1, overflow: "visible"}} key={index}>
                        <LineChart
                            dataset={graph}
                            xAxis={[{
                                dataKey: 'x',
                                label: `Time (s)`,
                                scaleType: "linear",
                                tickNumber: graph.length,
                                min: 20*(props.metricInterval / 1000),
                                max: 0,
                            }]}
                            yAxis={[{
                                label: 'Core Usage (%) ',
                                min: 0,
                                max: 100,
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
                                    strokeWidth: 1,
                                    r: 0,
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
                                        fill: 'var(--accent)',
                                        fontSize: 12,
                                    },
                                    [`.${axisClasses.label}`]: {
                                        fill: 'var(--accent)',
                                        fontSize: 12,
                                    },
                                },

                                [`.${legendClasses.label}`]: {
                                    color: 'var(--accent)',
                                    fontSize: 14,
                                    fontWeight: 600,
                                },

                                // ===== Grid styling =====
                                [`.${chartsGridClasses.line}`]: {
                                    stroke: 'var(--neutral)',
                                    strokeWidth: 2,
                                },

                                // ===== Container styling =====
                                backgroundColor: 'var(--primary)',
                                borderRadius: 8,
                            })}
                        />
                    </div>
                )
            })
        } else {
            renderChaosGraph = () => {
                return (
                    <div style={{flex: 1}}>
                        <LineChart
                            dataset={graphData}
                            xAxis={[{
                                dataKey: 'x',
                                label: `Time (s)`,
                                min: 20*(props.metricInterval / 1000),
                                max: 0,
                            }]}
                            yAxis={[{
                                label: 'Core Usage (%)',
                                min: 0,
                                max: 100,
                            }]}
                            series={cpuSeries}
                            grid={{ stroke: '#333', strokeWidth: 0.5, vertical: true, horizontal: true }}
                            height={600}
                            sx={(theme) => ({
                                // ===== Line styling =====
                                // [`.${lineElementClasses.root}`]: {
                                //     stroke: 'var(--secondary)',
                                //     strokeWidth: 3,
                                // },

                                // ===== Point markers =====
                                [`.${markElementClasses.root}`]: {
                                    strokeWidth: 1,
                                    r: 0,
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
                                        fill: 'var(--accent)',
                                        fontSize: 12,
                                    },
                                    [`.${axisClasses.label}`]: {
                                        fill: 'var(--accent)',
                                        fontSize: 12,
                                    },
                                },

                                [`.${legendClasses.label}`]: {
                                    color: 'var(--accent)',
                                    fontSize: 14,
                                    fontWeight: 600,
                                },

                                // ===== Grid styling =====
                                [`.${chartsGridClasses.line}`]: {
                                    stroke: 'var(--neutral)',
                                    strokeWidth: 2,
                                },

                                // ===== Container styling =====
                                backgroundColor: 'var(--primary)',
                                borderRadius: 8,
                            })}
                        />
                    </div>
                )
            }
        }
    }

    function renderCpuUsage(cpuList) {
        return cpuList.map((core) => {
            return (
                <li
                    key={core.no}>
                    <div className={'cpu-cores__item'}>
                        <p style={{borderRight: `3px solid var(--border-color)`, minWidth: `75px`, maxWidth: '120px', paddingRight: '10px'}}>Core-{core.no}</p>
                        <p>{core.usage}%</p>
                    </div>

                    <div className={'cpu-usage-bar'} style={{width: core.usage + '%', backgroundColor: core.usage >= 40 ? core.usage >=70 ? 'red' : 'orange' : 'var(--tertiary)'}}></div>

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
                    <>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--neutral)', borderTop: '1px solid var(--neutral)', padding: '10px'}}>
                            <p>Graph Type</p>
                            <button className={'general-button'} onClick={() => {
                                setIsChaosGraph(prevState => !prevState);
                                setGraphData([])
                                localStorage.setItem("cpuChaosGraph", isChaosGraph.toString())
                            }}>{isChaosGraph? 'Normal' : 'Chaos'}</button>
                        </div>
                        {isChaosGraph ?

                        renderChaosGraph()

                        :

                        <div className={'cpu-cores__graph-container'}>
                            {renderGraphs}
                        </div>}
                    </>
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