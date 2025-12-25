import {createRef, useEffect, useState} from "react";
import * as rangeCheck from "range_check";

import './index.css'
import Header from "./components/Header";
import DeviceData from "./components/DeviceData.jsx";
import CpuData from "./components/CpuData.jsx";
import MemoryData from "./components/MemoryData.jsx";
import Settings from "./components/Settings.jsx";
import GpuData from "./components/GpuData.jsx";
import DeviceManagement from "./components/DeviceManagement.jsx";
import Notification from "./components/Notification.jsx";
import DeviceTypeSelection from "./components/DeviceTypeSelection.jsx";

export default function App() {

    const [hostIp, setHostIP] = useState(() => {
        const hostPublicIP = localStorage.getItem('hostPublicIP')
        if (hostPublicIP) {
            return hostPublicIP
        }else {
            return ""
        }
    });

    useEffect(() => {
        async function getPublicIP() {
            const res = await fetch("http://api.ipify.org?format=json");
            const data = await res.json();
            localStorage.setItem("hostPublicIP", data.ip);
            setHostIP(data.ip);
        }
        if (hostIp === "") getPublicIP();
    }, [hostIp]);

    const [notification, setNotification] = useState("");

    const [deviceType, setDeviceType] = useState(() => {
        const localStoreDeviceType = localStorage.getItem("deviceType");
        if (localStoreDeviceType === null || localStoreDeviceType === undefined || !localStoreDeviceType) {
            return ""
        } else {
            return localStoreDeviceType;
        }
    });

    const [devices, setDevices] = useState([])
    const [editDevice, setEditDevice] = useState(null);


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
            if(!selectedDevice) {
                return;
            }
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

    function changeRemoteDevice(ip) {
        setSelectedDevice(ip)
        console.log("[APP_METRICS] Change remote device: ", ip)
        handleNotification("notice", `changed Remote Device to:\n ${ip}`)
        setMetrics(null)
    }

    async function submitDevice(e) {
        e.preventDefault()
        const ip = e.target.ipAddress.value
        const name = e.target.deviceName.value
        //this only allows the ip[ address to be public ipv4 and valid ip addresses to be created  || (rangeCheck.isPrivateIP(ip))
        if ((!rangeCheck.isIP(ip)) || (rangeCheck.version(ip) !== 4)) {
            console.log("Please enter a valid public and IPv4 address")
            handleNotification("error", "Please enter a valid public and IPv4 address")
            return
        }
        if (!name) {
            handleNotification("error", "Please enter a name for your device")
            return
        }
        const newDevice = {
            name: name,
            ip: ip,
        }
        try {
            const response = await fetch(`http://${deviceType === 'host' ? "localhost" : hostIp}:3000/devices`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    device: newDevice
                })
            })
            if (response.ok) {
                const resData = await response.json()
                if (resData.success) {
                    handleNotification("notice", `successfully added the device "${ip}"`)
                    console.log(`Adding the ${ip} device.`)
                    setDevices((prev) => {
                        return [
                            ...prev,
                            newDevice
                        ]
                    })
                }
            }
        } catch (e) {
            console.error('Error attempting to add a device to the api', e.message)
        }
        if (deviceType === "host") {
            try {
                const response = await fetch("http://localhost:3001/")
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.className = "device-management__blob-link";
                    link.href = url;
                    link.download = "remote-device.zip";  // must match your filename
                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    //in the case where the browser is slow
                    setTimeout(() => {
                        window.URL.revokeObjectURL(url);
                    }, 1000);

                    handleNotification("success", "Downloaded your remote device script")
                }
            } catch (e) {
                handleNotification("error", "couldn't download your remote device script")
                console.error("Could not download the device script", e.message)
            }
        }
        e.target.reset()
    }

    let deviceButtonList
    console.error(devices)
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
          <Header metrics={metrics}
                  setIsDarkMode={setIsDarkMode}
                  isDarkMode={isDarkMode}
                  setActiveView={setActiveView}
                  activeView={activeView}
          />
          {(devices && activeView === "resources") && <div className={"device-navigation__wrapper"} ref={groupsRef} onWheel={handleWheel}>
              <div className={"device-navigation"}>
                  {deviceButtonList}
              </div>
          </div>}
          <main>
              {deviceType === "" && <DeviceTypeSelection setDeviceType={setDeviceType}/>}

              {metrics !== null &&
                  <>
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
                  </>
              }
              {activeView === "settings" &&<Settings setActiveView={setActiveView}
                                                     setIsDarkMode={setIsDarkMode}
                                                     isDarkMode={isDarkMode}
                                                     fontClicked={fontClicked}
                                                     setFontClicked={setFontClicked}
                                                     windowWidth={windowWidth}
                                                     handleNotification={handleNotification}
              />}
              {activeView === "devices" &&<DeviceManagement devices={devices} setDevices={setDevices} handleNotification={handleNotification} hostIp={hostIp} deviceType={deviceType} submitDevice={submitDevice}
                                                            editDevice={editDevice} setEditDevice={setEditDevice}/>}
          </main>
      </>
  )
}