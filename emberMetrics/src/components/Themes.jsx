import {useState} from "react";
import Sparkr from "../assets/SVG 2.1 | Original Sparkr.svg";
import Berry from "../assets/SVG 2.1 | Berry red.svg";
import Forest  from "../assets/SVG 2.1 | Forest Green.svg";
import Lavander from "../assets/SVG 2.1 | Lavander Mist.svg";
import Minty from "../assets/SVG 2.1 | Minty Fresh.svg";
import Sunrise from "../assets/SVG 2.1 | orange sunrise.svg";
import Royal   from "../assets/SVG 2.1 | Royal Purple.svg";
import Teal from "../assets/SVG 2.1 | Teal Lagoon.svg";
import Ocean from "../assets/SVG 2.1 | Ocean Blues.svg";
import Magenta from "../assets/SVG 2.1 | Sunset Magenta.svg";

export default function Themes (props){

    const storedTheme = localStorage.getItem("theme");


    const [themeClicked, setThemeClicked] = useState(null);

    function changeTheme (theme) {
        props.setLogoImage(theme.logo)
        document.documentElement.style.setProperty("--secondary", theme.colour.secondary)
        document.documentElement.style.setProperty("--tertiary", theme.colour.tertiary)
        //for darkMode
        document.documentElement.style.setProperty("--dm-tertiary", theme.colour.tertiary)
        document.documentElement.style.setProperty("--dm-secondary", theme.colour.secondary)
    }




    const themeList = props.themes.map(theme => {
        return (
            <div key={theme.name} className={"theme_wrapper"} onClick={() => {
                console.log("clicked Theme: " + theme.name)
                changeTheme(theme);
                setThemeClicked(theme)
            }}>
                <div className={(themeClicked === theme) || (storedTheme && JSON.parse(storedTheme).name === theme.name) ? "theme-container theme_wrapper_clicked" : "theme-container"}>
                    <div className={"theme"} style={{
                        backgroundColor: theme.colour.tertiary,

                    }}>

                    </div>
                </div>
                <p style={{
                    fontSize: "12px",
                    textAlign: "center",
                    width: "50px"
                }}>{theme.name}</p>
            </div>
        )
    })

    return (
        <form className={"theme-form"}>
            <div className="themes-container">
                {themeList}
            </div>
            {themeClicked && <div className="theme-form__buttons">
                <button className={"theme_save"} type={"button"} onClick={() => {
                    localStorage.setItem("theme", JSON.stringify(themeClicked));
                    setThemeClicked(null);
                }}>Save Theme</button>
                <button className={"theme_cancel"} type={"button"} onClick={() => {
                    console.log("cancelling theme selection")
                    setThemeClicked(null);
                    if (storedTheme) {
                        const themeObj = JSON.parse(storedTheme);
                        changeTheme(themeObj)
                    } else {
                        changeTheme(props.themes[0])
                    }
                }}>Cancel</button>
            </div>}

        </form>
    )
}