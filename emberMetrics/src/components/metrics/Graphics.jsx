import {useEffect, useState} from "react";
import {LineChart, markElementClasses} from "@mui/x-charts/LineChart";
import {axisClasses} from "@mui/x-charts/ChartsAxis";
import {legendClasses} from "@mui/x-charts/ChartsLegend";
import {chartsGridClasses} from "@mui/x-charts/ChartsGrid";

export default function Graphics({metrics, timeMetrics, isGraph, metricInterval}) {
    const gpuMetrics = metrics.gpuData
    const gpuName = gpuMetrics.name
    const gpuName_short = gpuName.length > 25 ? gpuName.slice(0, 25).trimEnd() + '…' : gpuName;

    if (!gpuMetrics) return null
    const [utilGraphData, setUtilGraphData] = useState([]);
    const [clockGraphData, setClockGraphData] = useState([]);

    useEffect(() => {
        if (!timeMetrics?.length || !isGraph) return;

        const utilDatasets = timeMetrics.map((snapshot, index) => {
            return                 {
                x: index*(metricInterval / 1000),
                mem: parseFloat(snapshot.gpuData.util.mem.percent),
                gpu: parseFloat(snapshot.gpuData.util.gpu),
                temp: parseFloat(snapshot.gpuData.temp)
            }
        })
        const clockDatasets = timeMetrics.map((snapshot, index) => {
            return                 {
                x: index*(metricInterval / 1000),
                gfx: parseFloat(snapshot.gpuData.clocks.gfx),
                mem: parseFloat(snapshot.gpuData.clocks.mem),
                memUsage: parseFloat(snapshot.gpuData.util.mem.used)
            }
        })
        setClockGraphData(clockDatasets)
        setUtilGraphData(utilDatasets)
    }, [timeMetrics])

    const renderClockGraph = () => {
        if (!isGraph) return;
        return(
            <div style={{flex: 1}} >
                <LineChart
                    dataset={clockGraphData}
                    xAxis={[{
                        dataKey: 'x',
                        label: `Time (s)`,
                        min: 20*(metricInterval / 1000),
                        max: 0,
                    }]}
                    yAxis={[
                        { id: 'mhzAxis', scaleType: 'linear', position: 'left', label: 'MHz' },
                        { id: 'gbAxis', scaleType: 'linear', min: -1, max: parseFloat(gpuMetrics.util.mem.total), position: 'right', label: 'usage GB' },
                    ]}
                    series={[
                        {
                            dataKey: 'mem',
                            label: 'Memory',
                            color: 'var(--tertiary)',
                        },
                        {
                            dataKey: 'gfx',
                            label: 'GPU',
                            color: 'var(--secondary)'
                        },
                        {
                            dataKey: 'memUsage',
                            label: 'Memory Usage',
                            color: '#fc2d79',
                            yAxisId: 'gbAxis'
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

    const renderUtilGraph = () => {
        if (!isGraph) return;
        return(
            <div style={{flex: 1}} >
                <LineChart
                    dataset={utilGraphData}
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
                    <div className={'graphics-entry graphics-name'}>
                        <label>Name</label>
                        <p title={gpuName}>{gpuName_short ? gpuName_short : gpuName}</p>
                    </div>
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
                    {!isGraph &&
                        <div className={'graphics-entry'}>
                            <label>Used Memory</label>
                            <p>{gpuMetrics.util.mem.used}</p>
                        </div>
                    }
                </div>
            </div>
            <header className={'section-header'} style={{maxWidth: '100%'}}>
                <h1>Clocks</h1>
            </header>
            {isGraph ?
                <>
                    {renderClockGraph()}
                </>
                :
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
            }
            <header className={'section-header'} style={{maxWidth: '100%'}}>
                <h1>Utilisation</h1>
            </header>
            {isGraph ?
                <>
                    {renderUtilGraph()}
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