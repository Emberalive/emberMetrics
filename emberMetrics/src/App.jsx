import {useEffect, useState} from "react";

import './index.css'
import Header from "./components/Header";
import DeviceData from "./components/DeviceData.jsx";
import CpuData from "./components/CpuData.jsx";
import MemoryData from "./components/MemoryData.jsx";
import Settings from "./components/Settings.jsx";
import GpuData from "./components/GpuData.jsx";
import DeviceManagement from "./components/DeviceManagement.jsx";
import Notification from "./components/Notification.jsx";

export default function App() {

    useEffect(() => {
        localStorage.setItem("devices", "");
    }, [])

    const [notification, setNotification] = useState("");

    const [devices, setDevices] = useState(() => {
        const devicesString = localStorage.getItem("devices") ? JSON.parse(localStorage.getItem("devices")) : []
        console.error(devicesString);
        return (devicesString);
    })

    const [fontClicked, setFontClicked] = useState("medium");

    const [activeView, setActiveView] = useState("resources")

    const [metrics, setMetrics] = useState(null)
    const [isDarkMode, setIsDarkMode] = useState("false");

    const [viewPort,setViewPort ] = useState([]);

    let windowWidth = window.innerWidth

    function handleNotification (type, message) {
        setNotification({type: type, message: message})
        setTimeout(() => {
            setNotification("")
        }, 2000)
    }

    useEffect(() => {
        //stores state changes in localStorage for the devices
        localStorage.setItem("devices", JSON.stringify(devices));
    }, [devices])

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
                const response = await fetch(`http://localhost:3000`)
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
            handleNotification("error", "There was an error fetching metrics")
        }
    }, [])

  return (
      <>
          <Notification notification={notification} setNotification={setNotification} />
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
              {activeView === "devices" &&<DeviceManagement devices={devices} setDevices={setDevices} handleNotification={handleNotification} />}
          </main>}
      </>
  )
}