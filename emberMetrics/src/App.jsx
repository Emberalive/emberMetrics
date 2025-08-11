import os from 'os'
import {useEffect, useState} from "react";

function App() {
const [metrics, setMetrics] = useState({})
    //deviceData = Obj
    //memoryUsage int
    //cpuUsage [int]

    //getCPU usage
    useEffect(() => {

    }, [])

  return (
      <>
          <h1>EmberMetrics - </h1>
          <h2>{metrics.hostName}</h2>
          <ul>
              {
                  metrics.deviceData && metrics.deviceData.map((label, value) => {
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
              {metrics.cpuUsage && metrics.cpuUsage.map((core) => {
                  return (
                      <li key={core.no}>
                          <h3>{core.no}</h3>
                          <strong>{core.usage}</strong>
                      </li>
                  )
              })}
          </ul>
          <h3>Memory</h3>
          <p>Memory: <strong>{metrics.memoryUsage}</strong></p>
      </>
  )
}

export default App
