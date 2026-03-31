import NetworkData from "./NetworkData.jsx";
import DeviceData from "./DeviceData.jsx";
import ChildProcesses from "./ChildProcesses.jsx";
import DiskData from "./DiskData.jsx";
import MemoryData from "./MemoryData.jsx";
import CpuData from "./CpuData.jsx";
import Graphics from "./Graphics.jsx";

export default function Metrics({metrics, isGraph, timeMetrics, metricInterval, handleNotification, viewPort, themes, randomColour, activeView, isDarkMode, childProcessFilter}) {

    return (
        <>
            {metrics !== null &&
                <>
                    {(activeView === "resources" || activeView === "fullScreen") && <>
                        <div className={"left-column"}>
                            {isGraph?
                                <>
                                    <NetworkData metrics={metrics}
                                                 isGraph={isGraph}
                                                 timeMetrics={timeMetrics}
                                                 metricInterval={metricInterval}
                                                 isDarkMode={isDarkMode}/>
                                    <DeviceData metrics={metrics}
                                                metricInterval={metricInterval}
                                                isDarkMode={isDarkMode}/>
                                    <ChildProcesses metrics={metrics}
                                                    isDarkMode={isDarkMode}
                                                    childProcessFilter={childProcessFilter}/>
                                </>:
                                <>
                                    {/*<DeviceData metrics={metrics}/>*/}
                                    {/*<ChildProcesses metrics={metrics}*/}
                                    {/*                handleNotification={handleNotification}*/}
                                    {/*                childProcessFilter={childProcessFilter}/>*/}
                                    {/*<DiskData metrics={metrics}/>*/}
                                    <Graphics metrics={metrics} timeMetrics={timeMetrics}/>
                                </>
                            }
                        </div>

                        <div className={"right-column"}>
                            {isGraph?
                                <>
                                    <MemoryData metrics={metrics}
                                                viewPort={viewPort}
                                                isGraph={isGraph}
                                                timeMetrics={timeMetrics}
                                                metricInterval={metricInterval}
                                                isDarkMode={isDarkMode}
                                    />
                                    <CpuData metrics={metrics}
                                             isGraph={isGraph}
                                             timeMetrics={timeMetrics}
                                             themes={themes}
                                             randomColour={randomColour}
                                             metricInterval={metricInterval}
                                             isDarkMode={isDarkMode}/>
                                    <DiskData metrics={metrics}
                                              isGraph={isGraph}
                                              timeMetrics={timeMetrics}
                                              metricInterval={metricInterval}
                                              isDarkMode={isDarkMode}/>
                                </>:
                                <>
                                    {/*<CpuData metrics={metrics} themes={themes}/>*/}
                                    {/*<MemoryData metrics={metrics}*/}
                                    {/*            viewPort={viewPort}*/}
                                    {/*            isGraph={isGraph}*/}
                                    {/*            timeMetrics={timeMetrics}*/}
                                    {/*/>*/}
                                    {/*<NetworkData metrics={metrics}*/}
                                    {/*             isGraph={isGraph}*/}
                                    {/*             timeMetrics={timeMetrics}/>*/}
                                </>
                            }
                        </div>
                    </>}
                </>
            }
                {(metrics === null && activeView==='resources') &&
                <div className={'metrics-notice__wrapper'}>
                    <section className={'metrics-notice'}>
                        <h1>Device can not be accessed</h1>
                        <p>Check these things:</p>
                        <p>1. The remote device is powered on</p>
                        <p>2. The remote device API is running</p>
                        <p>3. The remote device has port forwarding on for port: '3000'</p>
                        <p>4. The router has port forwarding on for port: '3000'</p>
                        <p>5. The IP address is correct - needs to be a public IPV4</p>
                    </section>
                </div>
            }
        </>
    )
}