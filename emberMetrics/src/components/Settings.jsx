import Themes from "./Themes.jsx";

export default function Settings (props) {
    return (
        <div className="settings__container">
            <div className="settings">
                <header className="settings-header">
                    <h1>Settings</h1>

                </header>
                <div className="settings-entry">
                    <p style={{
                        borderRight: "2px solid var(--border-color)",
                        paddingRight: "30px",
                    }}    >Display Mode: </p>
                    <button className="general-button" onClick={ () => {
                        props.setIsDarkMode(prevState => !prevState);
                        props.toggleView()
                    }}>{props.isDarkMode ? "Light Mode" : "Dark Mode"}</button>
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