import {useEffect, useState} from "react";
import {LineChart} from "@mui/x-charts/LineChart";
import {axisClasses} from "@mui/x-charts/ChartsAxis";
import {legendClasses} from "@mui/x-charts/ChartsLegend";
import {chartsGridClasses} from "@mui/x-charts/ChartsGrid";

export default function DiskData (props) {
    const disks = props.metrics.disks.disks
    const diskData = props.metrics.disks.totalDiskUsage

    const [graphData, setGraphData] = useState([]);


    useEffect(() => {
        if (!props.timeMetrics?.length || !props.isGraph) return;

        const datasets = props.timeMetrics.map((snapshot, index) => {
            return                 {
                x: index,
                wIO_sec: parseFloat(snapshot.disks.totalDiskUsage.wIO_sec),
                rIO_sec: parseFloat(snapshot.disks.totalDiskUsage.rIO_sec)
            }
        })
        setGraphData(datasets)
    }, [props.timeMetrics])


    const renderGraph = () => {
        if (!props.isGraph) return;
        return(
            <div style={{flex: 1}} >
                <LineChart
                    dataset={graphData}
                    xAxis={[{
                        dataKey: 'x',
                    }]}
                    series={[
                        {
                            dataKey: 'rIO_sec',
                            label: 'Reads /s',
                            color: 'aliceblue'
                        },
                        {
                            dataKey: 'wIO_sec',
                            label: 'Writes /s (b)',
                            color: 'var(--secondary)'
                        }
                    ]}
                    grid={{ stroke: '#333', strokeWidth: 0.5, vertical: true, horizontal: true }}
                    height={400}
                    sx={(theme) => ({
                        // ===== Line styling =====
                        // [`.${lineElementClasses.root}`]: {
                        //     stroke: 'var(--secondary)',
                        //     strokeWidth: 3,
                        // },

                        // ===== Point markers =====
                        // [`.${markElementClasses.root}`]: {
                        //     fill: 'var(--tertiary)',
                        //     stroke: '#42b883',
                        //     strokeWidth: 2,
                        //     r: 4,
                        // },

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
        )
    }

    // const graphDataArray = graphData.map((data, index) => {
    //     return (
    //
    //     )
    // })


    const diskList = disks.map((disk) => {
        return (
                <div className={disks.length < 2 ? 'disk-usage-item__single-item' : 'disk-container__item'} key={disk.name}>
                    <p>{disk.name}</p>
                    <div className={'disk-item__entry'}>
                        <label>Type: </label>
                        <p>{disk.type}</p>
                    </div>
                    <div className={'disk-item__entry'}>
                        <label>Vendor: </label>
                        <p>{disk.vendor}</p>
                    </div>
                    <div className={'disk-item__entry'}>
                        <label>Device: </label>
                        <p>{disk.device}</p>
                    </div>
                    <div className={'disk-item__entry'}>
                        <label>Size: </label>
                        <p>{disk.size}</p>
                    </div>
                    <div className={'disk-item__entry'}>
                        <label>Interface: </label>
                        <p>{disk.interfaceType}</p>
                    </div>
                </div>
        )
    })
    return (
        <section>
            <header className="section-header">
                <h1>Disk Data</h1>
            </header>
            <div className={disks.length < 2 ? 'disk-container__single-disk' : 'disk-container' }>
                {diskList}
            </div>
            <header className="section-header">
                <p style={{borderBottom: '1px solid var(--border-color)', width: '100%', marginBottom: '10px'}}>Disk Usage</p>
            </header>
            {props.isGraph ?
                <>
                    {renderGraph()}
                </>
                :
                <>
                    <div className="disk-usage__container">
                        <div className="disk-usage__item">
                            <label title={'Total read operations'}>rIO:</label>
                            <p>{diskData.rIO}</p>
                        </div>
                        <div className="disk-usage__item">
                            <label title={'Total write operations'}>wIO:</label>
                            <p>{diskData.wIO}</p>
                        </div>
                        <div className="disk-usage__item">
                            <label title={'Bytes read per second'}>rIO_sec:</label>
                            <p>{diskData.rIO_sec}b/s</p>
                        </div>
                        <div className="disk-usage__item">
                            <label title={'Bytes written per second'}>wIO_sec:</label>
                            <p>{diskData.wIO_sec}b/s</p>
                        </div>
                    </div>
                </>

            }
        </section>
    )
}