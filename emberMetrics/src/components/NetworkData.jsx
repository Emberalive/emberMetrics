export default function NetworkData(props) {
    const networkData = props.metrics.interfaces
    let networkDataList = []
    // let networkUsage = []
    if (networkData) {
      networkDataList = networkData.map(network => {
          return (
              <div className="network-container__item" key={network.name}>
                  <div className="interface-name__container">
                      <p  className="interface-name" >{network.name}</p>
                      {network.default && <p>Default</p>}
                  </div>

                  <div style={{borderBottom: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)', paddingLeft: '5px'}}>
                      <header className={"section-header"} style={{paddingTop: '5px'}}>
                          <h1 style={{fontSize: 'calc(var(--font-size-header) - 5px)', margin: 0, paddingBottom: '4px'}}>Details:</h1>
                      </header>
                      <div className={'interface-data__item'}>
                          <p className={'interface-data__type'}>MAC: </p>
                          <p className={'interface-data-item__value'}>{network.mac}</p>
                      </div>
                      <div className={'interface-data__item'}>
                          <p className={'interface-data__type'}>Type: </p>
                          <p className={'interface-data-item__value'}>{network.type}</p>
                      </div>
                      <div className={'interface-data__item'}>
                          <p className={'interface-data__type'}>IP4: </p>
                          <p className={'interface-data-item__value'}>{network.addresses.ip4}</p>
                      </div>
                      <div className={'interface-data__item'}>
                          <p className={'interface-data__type'}>IP6: </p>
                          <p className={'interface-data-item__value'} style={{minHeight: 'calc(var(--font-size) *4)'}}>{network.addresses.ip6}</p>
                      </div>
                  </div>

                  <div style={{paddingLeft: '5px'}}>
                      <header className={"section-header"} style={{paddingTop: '5px'}}>
                          <h1 style={{width: '100%'}}>Network Usage</h1>
                      </header>
                      <div>
                          <div className="interface-data__item">
                              <p className={'interface-data__type'} >Transmitted:</p>
                              <p>{network.data.transmitted}</p>
                          </div>
                          <div className="interface-data__item">
                              <p className={'interface-data__type'} >Received:</p>
                              <p>{network.data.received}</p>
                          </div>
                      </div>
                  </div>
              </div>
          )
      })
      // networkUsage = networkData.map(network => {
      //
      // })
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