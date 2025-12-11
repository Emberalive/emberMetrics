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
        const devicesList = localStorage.getItem("devices") ? JSON.parse(localStorage.getItem("devices")) : []
        if (!devicesList[0]) {
            devicesList.push({
                ip: "127.0.0.1",
                name: "localhost"
            })
        } else if (devicesList[0].name !== "localhost") {
            devicesList.push({
                ip: "127.0.0.1",
                name: "localhost"
            })
        }
        return (devicesList);
    })

    const [selectedDevice, setSelectedDevice] = useState(devices[0].ip);

    const [fontClicked, setFontClicked] = useState("medium");

    const [activeView, setActiveView] = useState("resources")

    const [metrics, setMetrics] = useState(null)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
        if (darkMode) {
            return true
        } else {
            return false
        }
    });

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
        if (savedTheme) {
            document.documentElement.style.setProperty("--secondary", savedTheme.colour.secondary);
            document.documentElement.style.setProperty("--tertiary", savedTheme.colour.tertiary);

            document.documentElement.style.setProperty("--dm-tertiary", savedTheme.colour.tertiary)
            document.documentElement.style.setProperty("--dm-secondary", savedTheme.colour.secondary)
        }
    }, [])


    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark-mode");
        } else {
            document.documentElement.classList.remove("dark-mode");
        }    }, [isDarkMode])

    useEffect( () => {
        console.log("[APP_METRICS] Getting metrics")
        try {
            const interval = setInterval(async () => {
                const response = await fetch(`http://${selectedDevice}:3000`)
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
    }, [selectedDevice])

    useEffect(() => {
        console.error("[APP_METRICS] selected device for resources", selectedDevice)
    }, [selectedDevice])

    function changeRemoteDevice(ip) {
        setSelectedDevice(ip)
        console.log("[APP_METRICS] Change remote device: ", ip)
        handleNotification("notice", `changed Remote Device to:\n ${ip}`)
        setMetrics(null)
    }

    const deviceButtonList = devices.map((device) => {
        return(<button className={"general-button"} onClick={() => changeRemoteDevice(device.ip)}>{device.name}</button>)
    })

  return (
      <>
          <Notification notification={notification} setNotification={setNotification} />
          <Header metrics={metrics}
                  setIsDarkMode={setIsDarkMode}
                  isDarkMode={isDarkMode}
                  setActiveView={setActiveView}
                  activeView={activeView}
          />
          <section className={"memory-info"}>
              {deviceButtonList}
          </section>
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
                                                     isDarkMode={isDarkMode}
                                                     fontClicked={fontClicked}
                                                     setFontClicked={setFontClicked}
                                                     windowWidth={windowWidth}
                                                     handleNotification={handleNotification}
              />}
              {activeView === "devices" &&<DeviceManagement devices={devices} setDevices={setDevices} handleNotification={handleNotification} />}
          </main>}
      </>
  )
}