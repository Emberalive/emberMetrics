import TextArea from "../TextArea.jsx";

export default function DeviceData (props) {
    const deviceData = props.metrics.deviceData
    let deviceDataList
    if (deviceData) {
        deviceDataList = deviceData.map(value => {
            return (
                <li key={value.label}>
                    <p className={"data-item-label"}><strong>{value.label}</strong></p>
                    <p className={"data-item-value"}>{value.value}</p>
                </li>
            )
        })
    }


    return (
        <section className="device-data">
            <header className={'section-header'}>
                <h1>Device Data</h1>
            </header>
            {props.activeView !== 'fullScreen' && <TextArea data={{
                text: [{
                    text: 'This Module shows the device data: \n\n' +
                        '- The device Name\n' +
                        '- Operating system\n' +
                        '- Architecture\n' +
                        '- Operating system version'
                }],
                code: []
            }}/>}
        <ul className={'device-data_list'}>
                {deviceDataList}
            </ul>
        </section>
    )
}