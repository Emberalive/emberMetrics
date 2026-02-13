import TextArea from "../TextArea.jsx";

export default function NetworkData(props) {
    const networkData = props.metrics.interfaces
    let networkDataList = []
    // let networkUsage = []
    if (networkData) {
      networkDataList = networkData.map(network => {
          return (
              <div className={'network-interface__container'} key={network.name}>
                  <div className={'network-interface-name__container'}>
                      <p className={'network-interface__name'}>{network.name}</p>
                      {network.default && <p>Default</p>}
                  </div>
                  <header className={'network-interface__header'}>
                      <p>Details:</p>
                  </header>
                  <div className={'network-interface-item__container'}>
                      <div className={'network-interface__item'}>
                          <label>MAC: </label>
                          <p>{network.mac}</p>
                      </div>
                      <div className={'network-interface__item'}>
                          <label>Type: </label>
                          <p>{network.type}</p>
                      </div>
                      <div className={'network-interface__item'}>
                          <label>IP4: </label>
                          <p>{network.addresses.ip4}</p>
                      </div>
                      <div className={'network-interface__item'}>
                          <label>IP6: </label>
                          <p>{network.addresses.ip6}</p>
                      </div>
                  </div>
                  <header className={"network-interface__header"}>
                      <p>Network Usage</p>
                  </header>
                      <div className={'network-interface-usage__container'}>
                          <div className={'network-interface__item'}>
                              <label>Transmitted:</label>
                              <p>{network.data.transmitted}</p>
                          </div>
                          <div className={'network-interface__item'}>
                              <label>Received:</label>
                              <p>{network.data.received}</p>
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
            {props.activeView !== 'fullScreen' && <TextArea data={{
                text: [{
                    text: 'This module shows the network interfaces with basic information about them including:\n\n' +
                        '- Name of interface\n' +
                        '- The default interface\n' +
                        '- The type of interface\n' +
                        '- Ip6 and Ip4 addresses\n\n' +
                        'The module also shows the data transmitted and received per second in bytes per interface.'
                }],
                code: []
            }}/>}
            <div className={"network-container"}>
                {networkDataList}
            </div>
        </section>
    )
}