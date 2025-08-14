import {useEffect, useState} from "react";

import './index.css'
import Header from "./components/Header";
import DeviceData from "./components/DeviceData.jsx";
import CpuData from "./components/CpuData.jsx";
import MemoryData from "./components/MemoryData.jsx";

export default function App() {
    const [metrics, setMetrics] = useState(null)
    const [isDarkMode, setIsDarkMode] = useState("false");

    function toggleView(){
        document.documentElement.classList.toggle('dark-mode');
    }

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
          <Header metrics={metrics}
                  toggleView={toggleView}
                  setIsDarkMode={setIsDarkMode}
                  isDarkMode={isDarkMode}
          />
          <main>
              {metrics !== null && <>
                  <div className={"left-column"}>
                      <DeviceData metrics={metrics} />
                      <MemoryData metrics={metrics}/>
                  </div>

                <div className={"right-column"}>
                    <CpuData metrics={metrics}/>
                </div>
              </>}
          </main>
      </>
  )
}