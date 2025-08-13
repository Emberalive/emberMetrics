import {useEffect, useState} from "react";

import Header from "./components/Header";
import DeviceData from "./components/DeviceData.jsx";
import CpuData from "./components/CpuData.jsx";
import MemoryData from "./components/MemoryData.jsx";

export default function App() {
const [metrics, setMetrics] = useState(null)

    useEffect( () => {
        console.log("[APP_METRICS] Getting metrics")
        try {
            const interval = setInterval(async () => {
                const response = await fetch(`http://localhost:3000/`)

                if (response.status === 200) {
                    const resData = await response.json()

                    if (resData === null) {
                        console.error("[APP_METRICS] There was an error fetching metrics")
                    } else {
                        setMetrics(resData)
                        console.log(JSON.stringify(resData))
                    }
                }
            }, 1000)
            return () => clearInterval(interval)
        } catch (err) {
            console.error("[APP_METRICS] Error getting metrics: ", err.message)
        }
    }, [])

  return (
      <>
          <Header metrics={metrics} />

          {metrics !== null && <>
              <DeviceData metrics={metrics} />

              <h3>CPU's</h3>
                  <CpuData metrics={metrics}/>

              <MemoryData metrics={metrics}/>

              {/*<h3>Memory</h3>*/}
              {/*<p>Memory Used: <strong>{metrics.memoryUsage.usage}</strong></p>*/}
              {/*<p>Memory Available: <strong>{metrics.memoryUsage.available}</strong></p>*/}
          </>}
      </>
  )
}