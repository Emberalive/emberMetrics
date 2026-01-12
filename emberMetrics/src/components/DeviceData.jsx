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
        <ul className={'device-data_list'}>
                {deviceDataList}
            </ul>
        </section>
    )
}