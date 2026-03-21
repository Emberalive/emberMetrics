import Themes from "./Themes.jsx";
import SubNav from "../shared/SubNav.jsx";
import {useState} from "react";
import Profile from "../user-auth/Profile.jsx";

export default function Settings (props) {
    const [settingsView, setSettingsView] = useState('Settings');
    const settingsNav = ['Settings', 'Profile']

    return (
        <div className="settings-wrapper">
            <section className="settings">
                <SubNav subView={settingsView} setSubView={setSettingsView} subNavList={settingsNav}/>
                {settingsView === 'Settings' && <div>
                    <header className="settings-header">
                        <h1>Settings</h1>
                    </header>
                    <div className="settings-entry">
                        <p className="settings-entry__label">Display Mode: </p>
                        <div className={"settings-entry__value-container"} style={{display: "flex"}}>
                            <button
                                className={props.isDarkMode ? "general-button__selection general-button-selection__clicked" : "general-button__selection"}
                                onClick={() => {
                                    props.setIsDarkMode(true);
                                }}>DarkMode
                            </button>
                            <button
                                className={!props.isDarkMode ? "general-button__selection general-button-selection__clicked" : "general-button__selection"}
                                onClick={() => {
                                    props.setIsDarkMode(false);
                                }}>LightMode
                            </button>
                        </div>
                    </div>
                    <div className="settings-entry">
                        <p className="settings-entry__label">Font Size:</p>
                        <div className={'settings-entry__value-container'}>
                            <button style={{fontSize: "10px"}} id="font-small"
                                    className={props.fontClicked === "small" ? "general-button-selection__clicked general-button__selection" : "general-button__selection"}
                                    onClick={() => {
                                        props.setFontClicked("small")
                                        props.changeFont("text", 10)
                                        props.changeFont("header", 20)
                                    }}>Small
                            </button>
                            <button style={{fontSize: "20px"}} id="font-medium"
                                    className={props.fontClicked === "medium" ? "general-button__selection general-button-selection__clicked" : "general-button__selection"}
                                    onClick={() => {
                                        props.setFontClicked("medium")
                                        props.changeFont("text", 20)
                                        props.changeFont("header", 30)
                                    }}>Medium
                            </button>
                            <button style={{fontSize: "30px"}} id="font-large"
                                    className={props.fontClicked === "large" ? "general-button__selection general-button-selection__clicked" : "general-button__selection"}
                                    onClick={() => {
                                        if (props.windowWidth <= 900) {
                                            props.handleNotification('error', 'Screen is too small')
                                            return
                                        }
                                        props.setFontClicked("large")
                                        props.changeFont("text", 30)
                                        props.changeFont("header", 40)
                                    }}>Large
                            </button>
                        </div>
                    </div>
                    <div className="theme-container__wrapper">
                        <h1 style={{
                            textAlign: "center",
                            fontColor: "var(--neutral)",
                        }}>Themes</h1>
                        <Themes setLogoImage={props.setLogoImage} themes={props.themes}/>
                    </div>
                </div>}
                {settingsView === 'Profile' && <Profile user={props.user} handleNotification={props.handleNotification} setUser={props.setUser} devices={props.devices} hostIp={props.hostIp}/>}
            </section>
        </div>
    )
}