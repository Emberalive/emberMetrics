import {LineChart, lineElementClasses, markElementClasses} from "@mui/x-charts/LineChart";
import {axisClasses} from "@mui/x-charts/ChartsAxis";
import {legendClasses} from "@mui/x-charts/ChartsLegend";
import {chartsGridClasses} from "@mui/x-charts/ChartsGrid";
import {useEffect, useState} from "react";

export default function NetworkData(props) {
    const networkData = props.metrics.interfaces
    let networkDataList = []

    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        if (!props.timeMetrics?.length || !props.isGraph) return;

        const interfaceCount = props.timeMetrics[0].interfaces.length;

        const datasets = Array.from({length: interfaceCount}, (_, i) =>
                props.timeMetrics.map((snapshot, timeIndex) => (
                       {
                           x: timeIndex,
                           transmitted: parseFloat(snapshot.interfaces[i].data.transmitted),
                           received: parseFloat(snapshot.interfaces[i].data.received)
                       }
                ))
            )
        setGraphData(datasets)
    }, [props.timeMetrics])

    const graphDataArray = graphData.map((data, index) => {
        if (!props.isGraph) return;
        return (
            <div style={{flex: 1}}>
                <header className="network-interface__header" style={{borderBottom: 'none'}}>
                    <p style={{margin: 'none'}}>{props.metrics.interfaces[index].name}</p>
                </header>
                <h1>{data.name}</h1>
                <LineChart
                    dataset={data}
                    xAxis={[{
                        dataKey: 'x',
                        label: 'Time (1s)',
                        min: 20,
                        max: 0,
                     }]}
                    yAxis={[{
                        label: 'bytes'
                    }]}
                    series={[
                        {
                            dataKey: 'transmitted',
                            label: 'Transmitted (b)',
                            color: 'aliceblue'
                        },
                        {
                            dataKey: 'received',
                            label: 'Received (b)',
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

    if (networkData) {
      networkDataList = networkData.map((network, index) => {
          return (
              <div className={'network-interface__container'} key={network.name}>
                  <div className={'network-interface-name__container'}>
                      <p className={'network-interface__name'}>{network.name}</p>
                      {network.default && <p>Default</p>}
                  </div>
                  <header className={'network-interface__header'}>
                      <p>Details:</p>
                  </header>
                  <div className={'network-interface-item__container'}>
                      <div className={'network-interface__item'}>
                          <label>MAC: </label>
                          <p>{network.mac}</p>
                      </div>
                      <div className={'network-interface__item'}>
                          <label>Type: </label>
                          <p>{network.type}</p>
                      </div>
                      <div className={'network-interface__item'}>
                          <label>IP4: </label>
                          <p>{network.addresses.ip4}</p>
                      </div>
                      <div className={'network-interface__item'}>
                          <label>IP6: </label>
                          <p>{network.addresses.ip6}</p>
                      </div>
                  </div>
                  {!props.isGraph &&
                  <>
                      <header className={"network-interface__header"}>
                          <p>Network Usage</p>
                      </header>
                      <div className={'network-interface-usage__container'}>
                          <div className={'network-interface__item'}>
                              <label>Transmitted:</label>
                              <p>{network.data.transmitted}</p>
                          </div>
                      <div className={'network-interface__item'}>
                          <label>Received:</label>
                          <p>{network.data.received}</p>
                      </div>
                    </div>
                </>}
              </div>
          )
      })
    }
    return (
        <section>
            <header className={"section-header"}>
                <h1>Network Interfaces</h1>
            </header>
            <div className={"network-container"}>
                {networkDataList}
            </div>
            {props.isGraph &&
            <>
                <header className={'network-interface__header'} >
                    <p>Network Usage</p>
                </header>
                {graphDataArray}
            </>
            }
        </section>
    )
}