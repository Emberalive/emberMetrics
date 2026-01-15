export default function DiskData (props) {
    const disks = props.metrics.disks
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
            <div className={'disk-container'}>
                {diskList}
            </div>
        </section>
    )
}