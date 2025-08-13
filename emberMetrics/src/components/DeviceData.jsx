export default function DeviceData (props) {
    const deviceData = props.metrics.deviceData

    const deviceDataList = deviceData.map(value => {
        return (
            <li key={value.label}>
                <p><strong>{value.label}</strong></p>
                <p>{value.value}</p>
            </li>
        )
    })

    return (
        <section style={{
            border: "1px solid ",
            borderRadius: "10px",
            padding: "30px",
            margin: "10px",
        }}>
            {deviceDataList}
        </section>
    )
}