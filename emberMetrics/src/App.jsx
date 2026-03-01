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
import Login from "./components/Login.jsx";
import Profile from "./components/Profile.jsx";
import CollapseWhite from "./assets/collapse-white.svg";
import CollapseBlack from "./assets/collapse-black.svg";
import ExpandWhite from "./assets/expand-white.svg";
import ExpandBlack from "./assets/expand-black.svg";
import Sparkr from "./assets/SVG 2.1 | Original Sparkr.svg";
import Ocean from "./assets/SVG 2.1 | Ocean Blues.svg";
import Forest from "./assets/SVG 2.1 | Forest Green.svg";
import Royal from "./assets/SVG 2.1 | Royal Purple.svg";
import Berry from "./assets/SVG 2.1 | Berry red.svg";
import Magenta from "./assets/SVG 2.1 | Sunset Magenta.svg";
import Sunrise from "./assets/SVG 2.1 | orange sunrise.svg";
import Teal from "./assets/SVG 2.1 | Teal Lagoon.svg";
import Lavander from "./assets/SVG 2.1 | Lavander Mist.svg";
import Minty from "./assets/SVG 2.1 | Minty Fresh.svg";
import Sapphire from "./assets/SVG 2.1 | Midnight Sapphire.svg";
import Crimson from "./assets/SVG 2.1 | Crimson Ember.svg";
import Arctic from "./assets/SVG 2.1 | Arctic Cyan.svg";
import Copper from "./assets/SVG 2.1 | Copper Flame.svg";
import Emerald from "./assets/SVG 2.1 | Emerald Depths.svg";
import Violet from "./assets/SVG 2.1 | Violet Storm.svg";


export default function App() {
//<<-----------------------------Only edit this!!!!!----------------------------------------->>
    // This is a quick fix to allow the user to make the app have or not have authentication
    //change the value of authentication to false if you don't want a user system
    const authentication = true
//<<-------------------------^^^^^Only edit this^^^^^---------------------------------------->>

    //Nothing below here should be touched, you will most likely break the application!!!

    const [isGraph, setIsGraph] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!authentication);
    const [user, setUser] = useState(null);
    const [metricInterval, setMetricInterval] = useState(1000);
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
    }, [hostIp, deviceType, isLoggedIn]);

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
        if (!authentication) return;
        //if authentication doesn't exist don't run this function
        if (isLoggedIn && user) {
            const userDevices = user.devices;
            if (deviceType === "remote-access") {
                const localhost = userDevices.find((device) => device.name === 'localhost' || device.ip === '127.0.0.1')
                if (localhost) {
                    const updatedDevices = userDevices.map((device) => {
                        if (device.name === "localhost" && device.ip === "127.0.0.1") {
                            return {
                                name: 'host-device',
                                ip: hostIp,
                            };
                        }
                        return device;
                    })
                    setDevices(updatedDevices);
                    setSelectedDevice(updatedDevices[0].ip);
                } else {
                    handleNotification('error', 'could not find localhost device')
                }
            } else {
                setDevices(userDevices);
                setSelectedDevice(userDevices[0].ip);
            }
        }
    }, [user, isLoggedIn, deviceType, hostIp, authentication])

    useEffect(() => {
        async function getInitialDevices () {
            if (authentication) return
            //if authentication is true don't run this effect
            try {
                const response = await fetch(`http://${deviceType === "remote-access" ? hostIp : "127.0.0.1"}:3000/devices`);

                if (response.ok) {
                    const resData = await response.json();
                    const resData_devices = resData.devices
                    const newDevices = [...resData_devices];
                    if (deviceType === "") return
                    if (deviceType === "remote-access") {
                        const filteredDevices = newDevices.filter(
                            (d) => !(d.ip === "127.0.0.1" && d.name === "localhost")
                        );

                        if (filteredDevices.length === newDevices.length) {
                            handleNotification('error', 'Could not find localhost device');
                        }

                        if (hostIp) {
                            filteredDevices.push({
                                name: "Host-Device",
                                ip: hostIp,
                            });
                        }

                        setDevices(filteredDevices);
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
    }, [hostIp, deviceType, authentication]);

    useEffect(() => {
        //stores the deviceType in state
            localStorage.setItem("deviceType", deviceType);
    }, [deviceType])

    const [selectedDevice, setSelectedDevice] = useState();

    const [fontClicked, setFontClicked] = useState("medium");

    const [activeView, setActiveView] = useState(authentication ? deviceType === "" ? "deviceTypeSelection" : "login" : deviceType === "" ? "deviceTypeSelection" : "resources");

    const [metrics, setMetrics] = useState(null)
    //stores data over time for metrics, each object in the array is a value of teh metrics of each interval value
    const [timeMetrics, setTimeMetrics] = useState([])
    useEffect(() => {
        if (!metrics || !isGraph) return
        setTimeMetrics(prev => {
            const next = [metrics, ...prev ];
            if (next.length > 21) {
                next.pop(); //remove the oldest value
            }
            return next;
        })
    }, [metrics])

    const [themes, setThemes] = useState([
        {
            name: "Midnight Sapphire",
            colour: { secondary: "#2f5dff", tertiary: "#001f99" },
            logo: Sapphire,
        },
        {
            name: "Crimson Ember",
            colour: { secondary: "#ff4d4d", tertiary: "#b30000" },
            logo: Crimson,
        },
        {
            name: "Arctic Cyan",
            colour: { secondary: "#42d7ff", tertiary: "#0288a8" },
            logo: Arctic,
        },
        {
            name: "Copper Flame",
            colour: { secondary: "#ff7a42", tertiary: "#b34700" },
            logo: Copper,
        },
        {
            name: "Emerald Depths",
            colour: { secondary: "#2ecc71", tertiary: "#0b7a3e" },
            logo: Emerald,
        },
        {
            name: "Violet Storm",
            colour: { secondary: "#9b42ff", tertiary: "#4b0099" },
            logo: Violet,
        },
        {
            name: "Sparkr Original",
            colour: { secondary: "#FF8C42", tertiary: "#CC5803" },
            logo: Sparkr,
        },
        {
            name: "Ocean Blues",
            colour: { secondary: "#4287f5", tertiary: "#0349cc" },
            logo: Ocean,
        },
        {
            name: "Forest Greens",
            colour: { secondary: "#42b883", tertiary: "#0a7e4e" },
            logo: Forest,
        },
        {
            name: "Royal Purples",
            colour: { secondary: "#8a42ff", tertiary: "#5e03cc" },
            logo: Royal,
        },
        {
            name: "Berry Red",
            colour: { secondary: "#ff4270", tertiary: "#cc0349" },
            logo: Berry,
        },
        {
            name: "Sunset Magenta",
            colour: { secondary: "#ff42a4", tertiary: "#cc0377" },
            logo: Magenta,
        },
        {
            name: "Golden Sunrise",
            colour: { secondary: "#ffb142", tertiary: "#cc8403" },
            logo: Sunrise,
        },
        {
            name: "Teal Lagoon",
            colour: { secondary: "#42f5e6", tertiary: "#03cccc" },
            logo: Teal,
        },
        {
            name: "Lavender Mist",
            colour: { secondary: "#c742ff", tertiary: "#7f03cc" },
            logo: Lavander,
        },
        {
            name: "Minty Fresh",
            colour: { secondary: "#42f57a", tertiary: "#03cc49" },
            logo: Minty,
        },
    ]);

    function randomColour () {
        const index = Math.floor(Math.random() * themes.length);
        return themes[index].secondary;
    }

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

        useEffect(() => {
            if (authentication && !isLoggedIn) return;
            if (!isLoggedIn || activeView !== 'resources') return;
            if (!selectedDevice) return;

            let isMounted = true;
            //This prevents the interval from setting metrics after the interval has changed. preventing any setMetrics from calling
            //unexpectedly

            const fetchMetrics = async () => {
                try {
                    const response = await fetch(`http://${selectedDevice}:3000`);
                    if (response.ok) {
                        const resData = await response.json();
                        if (resData) {
                            if (isMounted) setMetrics(resData);
                        } else {
                            console.error("[APP_METRICS] Null metrics");
                        }
                    } else {
                        console.log("[APP_METRICS] Fetch error");
                    }
                } catch (err) {
                    console.error("[APP_METRICS] Error fetching metrics:", err.message);
                    handleNotification("error", "There was an error fetching metrics");
                }
            };

            fetchMetrics(); // optional: fetch immediately
            const interval = setInterval(fetchMetrics, metricInterval);

            return () => {
                isMounted = false;
                clearInterval(interval);
            };
        }, [selectedDevice, isLoggedIn, authentication, metricInterval, activeView]);

    function changeRemoteDevice(ip) {
        setSelectedDevice(ip)
        console.log("[APP_METRICS] Change remote device: ", ip)
        handleNotification("notice", `changed Remote Device to:\n ${ip}`)
        setMetrics(null)
    }

    let deviceButtonList
        if (devices){
            deviceButtonList = devices.map((device) => {
                return(<button key={device.id} className={selectedDevice === device.ip ?"general-button disabled-button": "general-button"} onClick={() => changeRemoteDevice(device.ip)} style={{
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

    async function patchUser (updatedUser) {
        try {
            console.info('[ App.jsx - patchUser ] starting function')
            const response = await fetch(`http://${deviceType === "remote-access" ? hostIp : "127.0.0.1"}:3000/users`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: user.username,
                    newUser: updatedUser,
                })
            })
            if (response.ok) {
                const resData = await response.json()
                if (resData.success) {
                    console.info('[ App.jsx - patchUser ] setting the user data in state and sending notification')
                    handleNotification('notice', 'Successfully updated user data')
                    return {
                        success: true,
                        status: response.status,
                        updatedUser: resData.updatedUser
                    }
                }
                handleNotification('error', 'The request was incorrect')
            }
            console.info('[ App.jsx - patchUser ] error, API operation was unsuccessful')
            return {
                success: false,
                status: response.status
            }
        } catch (e) {
            console.error('There was an error',e.message)
            handleNotification('error', 'Server Error, sorry')
            return {
                success: false,
            }
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
          {((activeView === "resources" && devices) && isLoggedIn === true) && <div className={"device-navigation__wrapper"} ref={groupsRef} onWheel={handleWheel}>
              <div className={"device-navigation"}>
                  {deviceButtonList}
                  <button className={'general-button'} onClick={() => {
                      setIsGraph(prevState => !prevState)
                  }}>{isGraph ? 'detailed' : 'graphs'}</button>
              </div>
          </div>}
          <main className={(activeView === 'resources' || activeView === 'fullScreen') ? (deviceType === '' || (authentication === true && isLoggedIn === false) || !metrics) ? 'main-single-column' : '' : 'main-single-column'}>
              {(activeView === "deviceTypeSelection") && (deviceType === '') && <DeviceTypeSelection setDeviceType={setDeviceType} activeView={activeView} setActiveView={setActiveView} authentication={authentication}/>}
              {(authentication === false || isLoggedIn === true ) && <>
                  {deviceType === "" && <DeviceTypeSelection setDeviceType={setDeviceType} activeView={activeView}/>}

                  {metrics !== null &&
                      <>
                          {(activeView === "resources" || activeView === "fullScreen") && <>
                              <div className={"left-column"}>
                                  {isGraph?
                                    <>
                                        <NetworkData metrics={metrics}
                                                     isGraph={isGraph}
                                                     timeMetrics={timeMetrics}
                                                     metricInterval={metricInterval}/>
                                        <DeviceData metrics={metrics}
                                                    metricInterval={metricInterval}/>
                                    </>:
                                    <>
                                        <ChildProcesses metrics={metrics} handleNotification={handleNotification}/>
                                        {/*<DiskData metrics={metrics}/>*/}
                                        {/*<DeviceData metrics={metrics}/>*/}
                                    </>
                                  }
                              </div>

                              <div className={"right-column"}>
                                  {isGraph?
                                    <>
                                        <MemoryData metrics={metrics}
                                                    viewPort={viewPort}
                                                    isGraph={isGraph}
                                                    timeMetrics={timeMetrics}
                                                    metricInterval={metricInterval}
                                        />
                                        <CpuData metrics={metrics}
                                                 isGraph={isGraph}
                                                 timeMetrics={timeMetrics}
                                                 themes={themes}
                                                 randomColour={randomColour}
                                                 metricInterval={metricInterval}/>
                                        <ChildProcesses metrics={metrics}/>
                                        <DiskData metrics={metrics}
                                                  isGraph={isGraph}
                                                  timeMetrics={timeMetrics}
                                                  metricInterval={metricInterval}/>
                                    </>:
                                    <>
                                        {/*<CpuData metrics={metrics} themes={themes}/>*/}
                                        {/*<MemoryData metrics={metrics}*/}
                                        {/*            viewPort={viewPort}*/}
                                        {/*            isGraph={isGraph}*/}
                                        {/*            timeMetrics={timeMetrics}*/}
                                        {/*/>*/}
                                        {/*<NetworkData metrics={metrics}*/}
                                        {/*             isGraph={isGraph}*/}
                                        {/*             timeMetrics={timeMetrics}/>*/}
                                    </>
                                  }
                              </div>
                          </>}
                      </>
                  }
                  {!metrics && activeView === "resources" &&
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
                  {activeView === "settings" && <Settings setActiveView={setActiveView}
                                                          setIsDarkMode={setIsDarkMode}
                                                          isDarkMode={isDarkMode}
                                                          fontClicked={fontClicked}
                                                          setFontClicked={setFontClicked}
                                                          windowWidth={windowWidth}
                                                          handleNotification={handleNotification}
                                                          changeFont={changeFont}
                                                          setLogoImage={setLogoImage}
                                                          setmetricInterval={setMetricInterval}
                                                          metricInterval={metricInterval}
                                                          themes={themes}/>}

                  {activeView === "devices" && <DeviceManagement devices={devices}
                                                                 setDevices={setDevices}
                                                                 handleNotification={handleNotification}
                                                                 hostIp={hostIp}
                                                                 deviceType={deviceType}
                                                                 setUser={setUser}
                                                                 user={user}
                                                                 patchUser={patchUser}
                                                                 authentication={authentication}/>}
              </>}
              {activeView === 'profile' && <Profile user={user} handleNotification={handleNotification} setUser={setUser} patchUser={patchUser}/>}
              {activeView === 'login' && <Login handleNotification={handleNotification}
                                                                           hostIp={hostIp}
                                                                           setIsLoggedIn={setIsLoggedIn}
                                                                           deviceType={deviceType}
                                                                           setUser={setUser}
                                                                           devices={devices}
                                                                           setActiveView={setActiveView}/>}
          </main>
      </>
  )
}