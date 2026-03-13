export default function MetricsSettings(props) {
    return (
        <div className={props.isMetricSettings ? 'metrics-settings-wrapper' : 'metrics-settings-wrapper metrics-settings-wrapper__closed'} style={{display: 'flex', flexDirection: 'column', zIndex: '100'}} >
            <div className={'metrics-settings-container'}>
                <div className={'metrics-settings-entry'}>
                    <p className="settings-entry__label">Interval: </p>
                    <div className={"settings-entry__value-container"}>
                        <input type={'text'} value={props.metricInterval/1000} onChange={(e) => {
                            const parsed = parseFloat(e.target.value)

                            if (!Number.isNaN(parsed)) {
                                props.setMetricInterval(parsed * 1000)
                            } else if(e.target.value === '') {
                                props.setMetricInterval(0)
                            } else {
                                props.setMetricInterval(1000)
                                props.handleNotification('error', 'Please enter a valid number')
                            }
                        }}/>
                        <p>Seconds</p>
                    </div>
                </div>
                <div className={'metrics-settings-entry'}>
                    <p className="settings-entry__label">Processes No: </p>
                    <div className={"settings-entry__value-container"}>
                        <input type={'text'} value={props.childProcessLength} onChange={(e) => {
                            const length = Number(e.target.value)

                            if (!Number.isNaN(length)) {
                                props.setChildProcessLength(length)
                            } else {
                                props.setChildProcessLength(10)
                                props.handleNotification('error', 'Please enter a valid number')
                            }
                        }}/>
                        <p>Processes</p>
                    </div>
                </div>
                <div className={'metrics-settings-entry'}>
                    <p className="settings-entry__label">Metrics view</p>
                    <div className={"settings-entry__button-container"} style={{ display: "flex", gap: '20px'}}>
                        <button className={!props.isGraph ? "general-button__selection general-button-selection__clicked": "general-button__selection"} onClick={ () => {
                            props.setIsGraph(false)
                        }}>Detailed</button>
                        <button className={props.isGraph ? "general-button__selection general-button-selection__clicked" : "general-button__selection"} onClick={ () => {
                            props.setIsGraph(true)
                        }}>Graphs</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
