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
                                    {metrics.interfaces && <NetworkData metrics={metrics}
                                                  isGraph={isGraph}
                                                  timeMetrics={timeMetrics}
                                                  metricInterval={metricInterval}
                                                  isDarkMode={isDarkMode}/>}
                                    {metrics.deviceData && <DeviceData metrics={metrics}
                                                 metricInterval={metricInterval}
                                                 isDarkMode={isDarkMode}/>}
                                    {(metrics.gpuData && metrics.gpuData.vendor.includes('AMD')) && <Graphics metrics={metrics}
                                               timeMetrics={timeMetrics}
                                               isGraph={isGraph}
                                               metricInterval={metricInterval}/>}
                                </>:
                                <>
                                    {metrics.deviceData && <DeviceData metrics={metrics}/>}
                                    {metrics.childProcesses && <ChildProcesses metrics={metrics}
                                                     handleNotification={handleNotification}
                                                     childProcessFilter={childProcessFilter}/>}
                                    {metrics.disks && <DiskData metrics={metrics}/>}
                                    {(metrics.gpuData && metrics.gpuData.vendor.includes('AMD')) && <Graphics metrics={metrics}
                                               timeMetrics={timeMetrics}
                                               isGraph={isGraph}
                                               metricInterval={metricInterval}/>}
                                </>
                            }
                        </div>

                        <div className={"right-column"}>
                            {isGraph?
                                <>
                                    {metrics.memoryUsage && <MemoryData metrics={metrics}
                                                 viewPort={viewPort}
                                                 isGraph={isGraph}
                                                 timeMetrics={timeMetrics}
                                                 metricInterval={metricInterval}
                                                 isDarkMode={isDarkMode}
                                    />}
                                    {metrics.cpuUsage && <CpuData metrics={metrics}
                                              isGraph={isGraph}
                                              timeMetrics={timeMetrics}
                                              themes={themes}
                                              randomColour={randomColour}
                                              metricInterval={metricInterval}
                                              isDarkMode={isDarkMode}/>}
                                    {metrics.childProcesses && <ChildProcesses metrics={metrics}
                                                     isDarkMode={isDarkMode}
                                                     childProcessFilter={childProcessFilter}/>}
                                    {metrics.disks && <DiskData metrics={metrics}
                                               isGraph={isGraph}
                                               timeMetrics={timeMetrics}
                                               metricInterval={metricInterval}
                                               isDarkMode={isDarkMode}/>}
                                </>:
                                <>
                                    {metrics.cpuUsage && <CpuData metrics={metrics} themes={themes}/>}
                                    {metrics.memoryUsage && <MemoryData metrics={metrics}
                                                 viewPort={viewPort}
                                                 isGraph={isGraph}
                                                 timeMetrics={timeMetrics}
                                    />}
                                    {metrics.interfaces && <NetworkData metrics={metrics}
                                                  isGraph={isGraph}
                                                  timeMetrics={timeMetrics}/>}
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
