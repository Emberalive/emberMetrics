export default function MetricsSettings(props) {
    function handleInputs (value, setState, errorValue) {
        if (!value || typeof setState !== 'function' || !errorValue) {
            console.error(`[ Client - metricsSettings /handleInput ] setState is not a function or no value passed ${!!value}`)
            return
        }
        //don't need to check for 0 in value, because it is defined as false for a number
         if (Number.isNaN(value)) {
             setState(errorValue)
             props.handleNotification('error', 'value needs to be a number greater than 0')
         } else {
             setState(value)
         }
    }

    return (
        <div className={props.isMetricSettings ? 'metrics-settings-wrapper' : 'metrics-settings-wrapper metrics-settings-wrapper__closed'} style={{display: 'flex', flexDirection: 'column', zIndex: '100'}} >
            <div className={'metrics-settings-container'}>
                <div className={'metrics-settings-entry'}>
                    <p className="settings-entry__label">Interval: </p>
                    <div className={"settings-entry__value-container"}>
                        <input type={'number'} value={props.metricInterval/1000} onChange={(e) => {
                            const parsed = parseFloat(e.target.value) * 1000
                            handleInputs(parsed, props.setMetricInterval, 1000)
                            props.setTimeMetrics([])
                        }}/>
                        <p>Seconds</p>
                    </div>
                </div>
                <div className={'metrics-settings-entry'}>
                    <p className="settings-entry__label">Processes No: </p>
                    <div className={"settings-entry__value-container"}>
                        <input type={'number'} value={props.childProcessLength} onChange={(e) => {
                            const length = Number(e.target.value)
                            handleInputs(length, props.setChildProcessLength, 10)
                        }}/>
                        <p>Processes</p>
                    </div>
                </div>
                <div className={'metrics-settings-entry'}>
                    <p className="settings-entry__label">Metrics view</p>
                    <div className={"settings-entry__button-container"} style={{ display: "flex", gap: '20px'}}>
                        <button className={!props.isGraph ? "general-button__selection general-button-selection__clicked disabled-button": "general-button__selection"} onClick={ () => {
                            props.setIsGraph(false)
                        }}>Detailed</button>
                        <button className={props.isGraph ? "general-button__selection general-button-selection__clicked disabled-button" : "general-button__selection"} onClick={ () => {
                            props.setIsGraph(true)
                        }}>Graphs</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
