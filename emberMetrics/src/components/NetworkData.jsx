export default function NetworkData(props) {
    const networkData = props.metrics.interfaces
    let networkDataList = []
    if (networkData) {
      networkDataList = networkData.map(network => {
          return (
              <div className="network-container__item" >
                  <p className="interface-name">{network.name}</p>
                  <div className="interface-data__container">
                      <div className="interface-data__item">
                          <p className={'interface-data__type'} >Transmitted:</p>
                          <p>{network.data.transmitted}
                          </p>
                      </div>
                      <div className="interface-data__item">
                          <p className={'interface-data__type'} >Received:</p>
                          <p>{network.data.received}
                          </p>
                      </div>
                  </div>
              </div>
          )
      })
    }
    return (
        <section>
            <header className={"section-header"}>
                <h1>Network Interfaces</h1>
            </header>
            <div className={"network-container"}>
                {networkDataList}
            </div>
        </section>
    )
}