import {useEffect, useState} from "react";
import {LineChart, markElementClasses} from "@mui/x-charts/LineChart";
import {axisClasses} from "@mui/x-charts/ChartsAxis";
import {legendClasses} from "@mui/x-charts/ChartsLegend";
import {chartsGridClasses} from "@mui/x-charts/ChartsGrid";

export default function Graphics({metrics, timeMetrics, isGraph, metricInterval}) {
    const gpuMetrics = metrics.gpuData
    console.log(JSON.stringify(gpuMetrics.util, null, 2))

    if (!gpuMetrics) return null
    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        if (!timeMetrics?.length || !isGraph) return;

        const datasets = timeMetrics.map((snapshot, index) => {
            return                 {
                x: index*(metricInterval / 1000),
                mem: parseFloat(snapshot.gpuData.util.mem.percent),
                gpu: parseFloat(snapshot.gpuData.util.gpu),
                temp: parseFloat(snapshot.gpuData.temp)
            }
        })
        setGraphData(datasets)
    }, [timeMetrics])

    const renderGraph = () => {
        if (!isGraph) return;
        return(
            <div style={{flex: 1}} >
                <LineChart
                    dataset={graphData}
                    xAxis={[{
                        dataKey: 'x',
                        label: `Time (s)`,
                        min: 20*(metricInterval / 1000),
                        max: 0,
                    }]}
                    yAxis={[
                        { id: 'percentAxis', scaleType: 'linear', min: 0, max: 100, position: 'left', label: 'Percentage' },
                        { id: 'tempAxis', scaleType: 'linear', min: 0, max: 130, position: 'right', label: 'Temperature ℃' },
                    ]}
                    series={[
                        {
                            dataKey: 'mem',
                            label: 'Memory',
                            color: 'var(--tertiary)',
                        },
                        {
                            dataKey: 'gpu',
                            label: 'GPU',
                            color: 'var(--secondary)'
                        },
                        {
                            dataKey: 'temp',
                            label: 'Temperature',
                            color: '#fc2d79',
                        }
                    ]}
                    grid={{ stroke: '#333', strokeWidth: 0.5, vertical: true, horizontal: true }}
                    height={400}
                    sx={(theme) => ({
                        // ===== Point markers =====
                        [`.${markElementClasses.root}`]: {
                            strokeWidth: 2,
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
                                fontSize: 'var(--font-size)',
                            },
                            [`.${axisClasses.label}`]: {
                                fill: 'var(--accent)',
                                fontSize: 'var(--font-size)'    ,
                            },
                        },

                        [`.${legendClasses.label}`]: {
                            color: 'var(--accent)',
                            fontSize: 'var(--font-size)',
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

    return (
        <section>
            <header className={'section-header'} style={{justifyContent: 'space-between', maxWidth: '100%'}}>
                <h1>GPU Data</h1>
                <p style={{fontWeight: 'bold'}}>{`Temp: ${gpuMetrics.temp}`}</p>
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
            {isGraph ?
                <>
                    {renderGraph()}
                </>
                :
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
            }
        </section>
    )
}