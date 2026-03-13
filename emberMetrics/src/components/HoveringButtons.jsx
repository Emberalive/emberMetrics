import CollapseWhite from "../assets/collapse-white.svg";
import CollapseBlack from "../assets/collapse-black.svg";
import ExpandWhite from "../assets/expand-white.svg";
import ExpandBlack from "../assets/expand-black.svg";
import HamburgerBlack from "../assets/hamburger-menu-black.svg";
import HamburgerWhite from "../assets/hamburger-menu-white.svg";
import MetricsSettings from "./MetricsSettings.jsx";

export default function HoveringButtons (props) {
    return (
        <div>
                <div style={{marginLeft: '20px',}} onClick={() => {
                    if (props.activeView === "resources") {
                        props.setActiveView("fullScreen")
                    } else {
                        props.setActiveView("resources")
                    }
                }} title={props.activeView === 'fullScreen' ? "Minimise" : "Maximise"}>
                    <img className={'full-screen__close'} alt={'expand icon'}
                         src={props.activeView === 'fullScreen' ? props.isDarkMode ? CollapseWhite : CollapseBlack : props.isDarkMode ? ExpandWhite : ExpandBlack}></img>
                </div>

                <div style={{marginLeft: '20px',}} title={'metrics Setting'} onClick={() => {
                    props.setIsMetricSettings(prev => !prev);
                }}>
                    <img className={'metrics-menu'} alt={'expand icon'}
                         src={props.isDarkMode ? HamburgerBlack : HamburgerWhite}></img>
                </div>
                <MetricsSettings metricInterval={props.metricInterval}
                                                             handleNotification={props.handleNotification}
                                                             setChildProcessLength={props.setChildProcessLength}
                                                             childProcessLength={props.childProcessLength}
                                                             setIsGraph={props.setIsGraph} isGraph={props.isGraph}
                                                             isMetricSettings={props.isMetricSettings}
                                                             setMetricInterval={props.setMetricInterval}/>
        </div>

    )
}