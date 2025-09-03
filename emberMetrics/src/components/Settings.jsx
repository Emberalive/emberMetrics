import Themes from "./Themes.jsx";
import {useState} from "react";

export default function Settings (props) {
    function changeFont (type, size) {
        switch (type) {
            case "text":        document.documentElement.style.setProperty(`--font-size`, `${size}px`);
            break;
            case "header":     document.documentElement.style.setProperty(`--font-size-header`, `${size}px`);
        }
    }

    return (
        <div className="settings__container">
            <div className="settings">
                <header className="settings-header">
                    <h1>Settings</h1>

                </header>
                <div className="settings-entry">
                    <p className="settings-entry__label">Display Mode: </p>
                    <button className="general-button" onClick={ () => {
                        props.setIsDarkMode(prevState => !prevState);
                        props.toggleView()
                    }}>{props.isDarkMode ? "Light Mode" : "Dark Mode"}</button>
                </div>
                <div className="settings-entry">
                    <p className="settings-entry__label">Font Size:</p>
                    <div style={{display: "flex"}}>
                        <button id="font-small" className={props.fontClicked === "small" ? "general-button general-button__clicked": "general-button"} onClick={ () => {
                            props.setFontClicked("small")
                            changeFont("text",10)
                            changeFont("header", 20)
                        }}>Small</button>
                        <button id="font-medium" className={props.fontClicked === "medium" ? "general-button general-button__clicked": "general-button"} onClick={ () => {
                            props.setFontClicked("medium")
                            changeFont("text",20)
                            changeFont("header", 30)
                        }}>Medium</button>
                        <button id="font-large" className={props.fontClicked === "large" ? "general-button general-button__clicked": "general-button"} onClick={ () => {
                            props.setFontClicked("large")
                            changeFont("text", 30)
                            changeFont("header", 40)
                        }}>Large</button>
                    </div>

                </div>
                <div className="theme-container__wrapper">
                    <h1 style={{
                        textAlign: "center",
                        fontColor: "var(--neutral)",
                    }}>Themes</h1>
                    <Themes />
                </div>
            </div>
        </div>
    )
}