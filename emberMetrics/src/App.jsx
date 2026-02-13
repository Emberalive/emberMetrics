import {createRef, useEffect, useState} from "react";
import './index.css'
import Header from "./components/Header";
import DeviceData from "./components/DeviceData.jsx";
import CpuData from "./components/CpuData.jsx";
import MemoryData from "./components/MemoryData.jsx";
import Settings from "./components/Settings.jsx";
import ChildProcesses from "./components/ChildProcesses.jsx";
import DeviceManagement from "./components/DeviceManagement.jsx";
import Notification from "./components/Notification.jsx";
import DeviceTypeSelection from "./components/DeviceTypeSelection.jsx";
import NetworkData from "./components/NetworkData.jsx";
import DiskData from "./components/DiskData.jsx";
import CollapseWhite from "./assets/collapse-white.svg";
import CollapseBlack from "./assets/collapse-black.svg";
import ExpandWhite from "./assets/expand-white.svg";
import ExpandBlack from "./assets/expand-black.svg";
import Sparkr from "./assets/SVG 2.1 | Original Sparkr.svg";
import Login from "./components/Login.jsx";

export default function App() {
//<<-----------------------------Only edit this!!!!!----------------------------------------->>
    // This is a quick fix to allow the user to make the app have or not have authentication
    //change the value of authentication to false if you don't want a user system
    const authentication = true
//<<-----------------------------Only edit this!!!!!----------------------------------------->>

    //Nothing below here should be touched, you will most likely break the application!!!
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [hostIp, setHostIP] = useState(() => {
        const hostPublicIP = localStorage.getItem('hostPublicIP')
        if (hostPublicIP) {
            return hostPublicIP
        }else {
            return ""
        }
    });

    const [deviceType, setDeviceType] = useState(() => {
        const localStoreDeviceType = localStorage.getItem("deviceType");
        if (localStoreDeviceType === null || localStoreDeviceType === undefined || !localStoreDeviceType) {
            return ""
        } else {
            return localStoreDeviceType;
        }
    });

    const [logoImage, setLogoImage] = useState(() => Sparkr)

    useEffect(() => {
        async function getPublicIP() {
            const res = await fetch("http://api.ipify.org?format=json");
            const data = await res.json();
            localStorage.setItem("hostPublicIP", data.ip);
            setHostIP(data.ip);
        }
        if (hostIp === "" && deviceType === 'remote-access') getPublicIP();
    }, [hostIp, deviceType]);

    function changeFont (type, size) {
        switch (type) {
            case "text":        document.documentElement.style.setProperty(`--font-size`, `${size}px`);
                break;
            case "header":     document.documentElement.style.setProperty(`--font-size-header`, `${size}px`);
        }
    }

    const [notification, setNotification] = useState("");

    const [devices, setDevices] = useState([])

    useEffect(() => {
        async function getInitialDevices () {
            //
            try {
                const response = await fetch(`http://${deviceType === "remote-access" ? hostIp : "localhost"}:3000/devices`);

                if (response.ok) {
                    const resData = await response.json();
                    const resData_devices = resData.devices
                    const newDevices = [...resData_devices];
                    if (deviceType === "") return
                    if (deviceType === "remote-access") {
                        const index = newDevices.findIndex(
                            (d) => {
                                return d.ip === "localhost" && d.name === "localhost"
                            }
                        );
                        console.log("index of localhost", index);
                        if (index !== -1) {
                            console.log("[App.jsx - getInitialDevices] - removing localhost for remote-access device")
                            newDevices.splice(index, 1);
                        }
                        if (hostIp) {
                            console.log("[App.jsx - getInitialDevices] - adding hostDevice to remote-access device")
                            newDevices.push({
                                name: "Host-Device",
                                ip: hostIp,
                            });
                        }
                        setDevices(newDevices);
                        setSelectedDevice(newDevices[0].ip);
                        return;
                    }
                    setDevices(newDevices);
                    setSelectedDevice(newDevices[0].ip);
                } else {
                    setDevices([])
                }
            } catch (e) {
                console.error('error getting devices from the host', e.message);
            }
        }
        getInitialDevices()
    }, [hostIp, deviceType]);

    useEffect(() => {
        //stores the deviceType in state
            localStorage.setItem("deviceType", deviceType);
    }, [deviceType])

    const [selectedDevice, setSelectedDevice] = useState(() => {
        if (devices) return ""
        return devices.length !== 0 ? devices[0].ip : null
    });

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

    useEffect(() => {
        if (windowWidth <= 900 && fontClicked === 'large') {
            changeFont('text', 20);
            setFontClicked("medium");
        }
    }, [windowWidth, fontClicked]);

    function handleNotification (type, message) {
        setNotification({type: type, message: message})
        setTimeout(() => {
            setNotification("")
        }, 2000)
    }

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
            setLogoImage(savedTheme.logo)
        }
    }, [])


    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark-mode");
        } else {
            document.documentElement.classList.remove("dark-mode");
        }    }, [isDarkMode])

    useEffect( () => {
        if (!isLoggedIn) return
        console.log("[APP_METRICS] Getting metrics")
        try {
            const interval = setInterval(async () => {
                const response = await fetch (`http://${selectedDevice}:3000`)
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
    }, [selectedDevice, isLoggedIn])

    function changeRemoteDevice(ip) {
        setSelectedDevice(ip)
        console.log("[APP_METRICS] Change remote device: ", ip)
        handleNotification("notice", `changed Remote Device to:\n ${ip}`)
        setMetrics(null)
    }

    let deviceButtonList
        if (devices){
            deviceButtonList = devices.map((device) => {
                return(<button className={selectedDevice === device.ip ?"general-button disabled-button": "general-button"} onClick={() => changeRemoteDevice(device.ip)} style={{
                    minWidth: "fit-content",
                    maxWidth: "fit-content",
                }}>{device.name}</button>)
            })
        }

    const groupsRef = createRef()
    const handleWheel = (e) => {
        if (groupsRef.current) {
            e.preventDefault()
            groupsRef.current.scrollLeft += e.deltaY;
        }
    }
  return (
      <>
          <Notification notification={notification} setNotification={setNotification} />
          {(activeView === 'resources' || activeView === "fullScreen") && (authentication === false && isLoggedIn === false) && <div style={{marginLeft: '20px',}} onClick={() => {
              if (activeView === "resources") {
                  setActiveView("fullScreen")
              } else {
                  setActiveView("resources")
              }
          }} title={activeView === 'fullScreen' ? "Minimise" : "Maximise"}>
              <img className={'full-screen__close'} alt={'expand icon'}
                   src={activeView === 'fullScreen' ? isDarkMode ? CollapseWhite : CollapseBlack : isDarkMode ? ExpandWhite : ExpandBlack}></img>
          </div>}
          <Header metrics={metrics}
                   setIsDarkMode={setIsDarkMode}
                   isDarkMode={isDarkMode}
                   setActiveView={setActiveView}
                   activeView={activeView}
                  logoImage={logoImage}
                  viewPort={viewPort}
                  authentication={authentication}
                  isLoggedIn={isLoggedIn}
          />
          {((devices && activeView === "resources")&&(authentication === false && isLoggedIn === false)) && <div className={"device-navigation__wrapper"} ref={groupsRef} onWheel={handleWheel}>
              <div className={"device-navigation"}>
                  {deviceButtonList}
              </div>
          </div>}
          <main className={(activeView === 'resources' || activeView === 'fullScreen') ? (deviceType === '' || (authentication === true && isLoggedIn === false)) ? 'main-single-column' : '' : 'main-single-column'}>
              {(authentication === false || isLoggedIn === true ) && <>
                  {deviceType === "" && <DeviceTypeSelection setDeviceType={setDeviceType} activeView={activeView}/>}

                  {metrics !== null &&
                      <>
                          {(activeView === "resources" || activeView === "fullScreen") && <>
                              <div className={"left-column"}>
                                  <ChildProcesses metrics={metrics}/>
                                  <DeviceData metrics={metrics}/>
                                  <DiskData metrics={metrics}/>

                              </div>

                              <div className={"right-column"}>
                                  <CpuData metrics={metrics}/>
                                  <MemoryData metrics={metrics}
                                              viewPort={viewPort}
                                  />
                                  <NetworkData metrics={metrics}/>
                              </div>
                          </>}
                      </>
                  }
                  {activeView === "settings" && <Settings setActiveView={setActiveView}
                                                          setIsDarkMode={setIsDarkMode}
                                                          isDarkMode={isDarkMode}
                                                          fontClicked={fontClicked}
                                                          setFontClicked={setFontClicked}
                                                          windowWidth={windowWidth}
                                                          handleNotification={handleNotification}
                                                          changeFont={changeFont}
                                                          setLogoImage={setLogoImage}
                  />}
                  {activeView === "devices" && <DeviceManagement devices={devices} setDevices={setDevices}
                                                                 handleNotification={handleNotification} hostIp={hostIp}
                                                                 deviceType={deviceType}/>}
              </>}
              {(isLoggedIn === false && authentication === true) && <Login handleNotification={handleNotification} hostIp={hostIp} setIsLoggedIn={setIsLoggedIn} deviceType={deviceType}/>}
          </main>
      </>
  )
}