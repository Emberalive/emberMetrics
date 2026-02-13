import TextArea from "../TextArea.jsx";

export default function DiskData (props) {
    const disks = props.metrics.disks.disks
    const diskData = props.metrics.disks.totalDiskUsage
    if (!diskData) return
    const diskList = disks.map((disk) => {
        return (
                <div className={'disk-container__item'} key={disk.name}>
                    <p>{disk.name}</p>
                    <div className={'disk-item__entry'}>
                        <label>Type: </label>
                        <p>{disk.type}</p>
                    </div>
                    <div className={'disk-item__entry'}>
                        <label>Vendor: </label>
                        <p>{disk.vendor}</p>
                    </div>
                    <div className={'disk-item__entry'}>
                        <label>Device: </label>
                        <p>{disk.device}</p>
                    </div>
                    <div className={'disk-item__entry'}>
                        <label>Size: </label>
                        <p>{disk.size}</p>
                    </div>
                    <div className={'disk-item__entry'}>
                        <label>Interface: </label>
                        <p>{disk.interfaceType}</p>
                    </div>
                </div>
        )
    })
    return (
        <section>
            <header className="section-header">
                <h1>Disk Data</h1>
            </header>
            {props.activeView !== 'fullScreen' && <TextArea data={{
                text: [{
                    text: 'This Module shows the storage devices on the system, it shows basic information including their name, storage capacity and type of device.\n\n' +
                        'It also shows the total disk usage:\n\n' +
                        '- Total reads \'rIO\'\n' +
                        '- Total writes \'wIO\'\n' +
                        '- Reads and writes per second \'rIO_sec\', \'wIO_sec\''
                }],
                code: []
            }}/>}
            <div className={'disk-container'}>
                {diskList}
            </div>
            <header className="section-header">
                <p style={{borderBottom: '1px solid var(--border-color)', width: '100%', marginBottom: '10px'}}>Disk Usage</p>
            </header>
            <div className="disk-usage__container">
                <div className="disk-usage__item">
                    <label title={'Total read operations'}>rIO:</label>
                    <p>{diskData.rIO}</p>
                </div>
                <div className="disk-usage__item">
                    <label title={'Total write operations'}>wIO:</label>
                    <p>{diskData.wIO}</p>
                </div>
                <div className="disk-usage__item">
                    <label title={'Bytes read per second'}>rIO_sec:</label>
                    <p>{diskData.rIO_sec}b/s</p>
                </div>
                <div className="disk-usage__item">
                    <label title={'Bytes written per second'}>wIO_sec:</label>
                    <p>{diskData.wIO_sec}b/s</p>
                </div>
            </div>
        </section>
    )
}