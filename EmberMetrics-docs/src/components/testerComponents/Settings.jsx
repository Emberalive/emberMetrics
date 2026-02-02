import Themes from "./Themes.jsx";
import TextArea from "../TextArea.jsx";

export default function Settings (props) {


    return (
        <div className="settings-wrapper">
            <section style={{width: "calc(70% - 2rem)", marginBottom: "20px", border: 'none'}} >
                <TextArea data={{
                    text: ["This is the Settings for EmberMetrics, here will allow you to control the app as well as the website your currently on. The themes will change as well as the viewing mode (Dark or Light mode), Have a bit of fun and play around"],
                    code: []
                }}
                />
            </section>
            <section className="settings">
                <header className="settings-header">
                    <h1>Settings</h1>
                </header>
                <div className="settings-entry">
                    <p className="settings-entry__label">Display Mode: </p>
                    <div className={"settings-entry__button-container"} style={{ display: "flex"}}>
                        <button className={props.isDarkMode ? "general-button general-button__clicked": "general-button"} onClick={ () => {
                            props.setIsDarkMode(true);
                        }}>DarkMode</button>
                        <button className={!props.isDarkMode ? "general-button general-button__clicked" : "general-button"} onClick={ () => {
                            props.setIsDarkMode(false);
                        }}>LightMode</button>
                    </div>
                </div>
                <div className="settings-entry">
                    <p className="settings-entry__label">Font Size:</p>
                    <div style={{display: "flex"}}>
                        <button style={{fontSize: "10px", maxWidth: "100px", minWidth: "100px"}} id="font-small" className={props.fontClicked === "small" ? "general-button general-button__clicked": "general-button"} onClick={ () => {
                            props.setFontClicked("small")
                            props.changeFont("text",10)
                            props.changeFont("header", 20)
                        }}>Small</button>
                        <button style={{fontSize: "20px", maxWidth: "100px", minWidth: "100px"}} id="font-medium" className={props.fontClicked === "medium" ? "general-button general-button__clicked": "general-button"} onClick={ () => {
                            props.setFontClicked("medium")
                            props.changeFont("text",20)
                            props.changeFont("header", 30)
                        }}>Medium</button>
                        <button style={{fontSize: "30px", maxWidth: "100px", minWidth: "100px"}} id="font-large" className={props.fontClicked === "large" ? "general-button general-button__clicked": "general-button"} onClick={ () => {
                            if(props.windowWidth <= 900 ) {
                                props.handleNotification('error', 'Screen is too small')
                                return
                            }
                            props.setFontClicked("large")
                            props.changeFont("text", 30)
                            props.changeFont("header", 40)
                        }}>Large</button>
                    </div>

                </div>
                <div className="theme-container__wrapper">
                    <h1 style={{
                        textAlign: "center",
                        fontColor: "var(--neutral)",
                    }}>Themes</h1>
                    <Themes setLogoImage={props.setLogoImage} />
                </div>
            </section>
        </div>
    )
}