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

    const [themes, setThemes] = useState([
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


    const themeList = themes.map(theme => {
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
                        changeTheme(themes[0])
                    }
                }}>Cancel</button>
            </div>}

        </form>
    )
}