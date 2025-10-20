import {useEffect, useState} from "react";

import './index.css'
import Header from "./components/Header";
import DeviceData from "./components/DeviceData.jsx";
import CpuData from "./components/CpuData.jsx";
import MemoryData from "./components/MemoryData.jsx";
import Settings from "./components/Settings.jsx";
import GpuData from "./components/GpuData.jsx";

export default function App() {

    const [fontClicked, setFontClicked] = useState("medium");


    const [activeView, setActiveView] = useState("resources")

    const [metrics, setMetrics] = useState(null)
    const [isDarkMode, setIsDarkMode] = useState("false");

    const [viewPort,setViewPort ] = useState([]);

    let windowWidth = window.innerWidth

    useEffect(() => {
        const handleResize = () => {
            setViewPort(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [windowWidth])

    const savedTheme = JSON.parse(localStorage.getItem("theme"));


    useEffect(() => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            toggleView()
        }
        if (savedTheme) {
            document.documentElement.style.setProperty("--secondary", savedTheme.colour.secondary);
            document.documentElement.style.setProperty("--tertiary", savedTheme.colour.tertiary);

            document.documentElement.style.setProperty("--dm-tertiary", savedTheme.colour.tertiary)
            document.documentElement.style.setProperty("--dm-secondary", savedTheme.colour.secondary)
        }
    }, [])


    function toggleView(){
        document.documentElement.classList.toggle('dark-mode');
    }

    useEffect( () => {
        console.log("[APP_METRICS] Getting metrics")
        try {
            const interval = setInterval(async () => {
                const response = await fetch(`https://metrics-api.emberalive.com/`)
                if (response.ok) {
                    if (response.status === 200) {
                        const resData = await response.json()

                        if (resData === null) {
                            console.error("[APP_METRICS] There was an error fetching metrics")
                        } else {
                            setMetrics(resData)
                            console.log(JSON.stringify(resData))
                        }
                    }else {
                        console.log("[APP_METRICS] There was an error fetching metrics")
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
                  setActiveView={setActiveView}
                  activeView={activeView}
          />
          {metrics !== null &&<main>
              {activeView === "resources" &&<>
                  <div className={"left-column"}>
                      <DeviceData metrics={metrics}/>
                      <MemoryData metrics={metrics}
                                  viewPort={viewPort}
                      />
                  </div>

                  <div className={"right-column"}>
                      <CpuData metrics={metrics}/>
                      <GpuData metrics={metrics}/>
                  </div>
              </>}
              {activeView === "settings" &&<Settings setActiveView={setActiveView}
                                                     setIsDarkMode={setIsDarkMode}
                                                     toggleView={toggleView}
                                                     isDarkMode={isDarkMode}
                                                     fontClicked={fontClicked}
                                                     setFontClicked={setFontClicked}
              />}
          </main>}
      </>
  )
}