import {useEffect, useState} from "react";
import { LineChart, lineElementClasses, markElementClasses } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';
import { legendClasses } from '@mui/x-charts/ChartsLegend';

export default function MemoryData(props) {
    const memoryUsage = props.metrics.memoryUsage
    const [graphData, setGraphData] = useState([])

    useEffect(() => {
        if (!props.timeMetrics) return;
        const graphData = props.timeMetrics.map((data, index) => {
            return {x:index+1, y:parseFloat(data.memoryUsage.usage)}
        })
        setGraphData(graphData)
    }, [props.timeMetrics])

    if(!graphData.length) return null
    if (props.isGraph) {

        return (
            <section>
                <header className="section-header">
                    <h1>Memory Usage</h1>
                </header>
                <div style={{flex: 1}}>
                    <LineChart
                        dataset={graphData}
                        xAxis={[{
                            dataKey: 'x',
                          }]}
                        series={[{
                            dataKey: 'y',
                            label: 'Memory Usage (%)',
                            color: 'var(--tertiary)'
                        }]}
                        grid={{ stroke: '#333', strokeWidth: 0.5, vertical: true, horizontal: true }}
                        height={400}
                        sx={(theme) => ({
                            // ===== Line styling =====
                            [`.${lineElementClasses.root}`]: {
                                stroke: 'var(--secondary)',
                                strokeWidth: 3,
                            },

                            // ===== Point markers =====
                            [`.${markElementClasses.root}`]: {
                                fill: 'var(--tertiary)',
                                stroke: '#42b883',
                                strokeWidth: 2,
                                r: 4,
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
            </section>
        );
    }
    return (
        <section className="memory-info">
            <div className="memory-info__content">
                <div>
                    <p className={'memory-info__content-title'} >Memory used</p>
                    <p>{memoryUsage.usage}%</p>
                </div>
                <div>
                    <p className={'memory-info__content-title'}>Memory Available</p>
                    <p>{memoryUsage.available}%</p>
                </div>
                <div className={'memory-bar'} style={{width: 'calc('+ memoryUsage.usage + '% + var(--element-padding))', backgroundColor: memoryUsage.usage >= 40 ? memoryUsage.usage >=70 ? 'red' : 'orange' : 'var(--tertiary)'}}>
                </div>
            </div>
        </section>
    )
}