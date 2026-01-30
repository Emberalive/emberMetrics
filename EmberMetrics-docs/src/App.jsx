import './index.css'
import {useEffect, useState} from "react";
import Menu from "./components/Menu";

export default function App() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
        if (darkMode) {
            return true
        } else {
            return false
        }
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark-mode");
        } else {
            document.documentElement.classList.remove("dark-mode");
        }    }, [isDarkMode])

    return (
        <>
            <Menu />
        </>
    )

}