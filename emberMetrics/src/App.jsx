import {useEffect, useState} from "react";

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
          <h1>EmberMetrics</h1>
          {metrics !== null && <>
              <h2>{metrics.hostName}</h2>
              <ul>
                  {
                      metrics.deviceData.map((label, value) => {
                          return (
                              <li key={label}>
                                  <strong>{value}</strong>
                              </li>
                          )
                      })
                  }
              </ul>
              <h3>CPU's</h3>
              <ul>
                  <li>{metrics.cpuUsage.total}</li>

                  {metrics.cpuUsage.cores.map((core) => {
                      return (
                          <li key={core.no}>
                              <h3>{core.no}</h3>
                              <strong>{core.usage}</strong>
                          </li>
                      )
                  })}
                  {}
              </ul>
              <h3>Memory</h3>
              <p>Memory Used: <strong>{metrics.memoryUsage.usage}</strong></p>
              <p>Memory Available: <strong>{metrics.memoryUsage.available}</strong></p>
          </>}
      </>
  )
}