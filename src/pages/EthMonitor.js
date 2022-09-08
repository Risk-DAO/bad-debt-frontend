

import React, { Component } from "react";
import {observer} from "mobx-react"
import mainStore from "../stores/main.store"
import monitorStore from "../stores/monitor.store"
import TableView from "../components/TableView1";

class EthMonitor extends Component {

  constructor(props) {
    super(props);
  }

  render () {
    const theme = mainStore.blackMode ? 'dark' : 'light';
    return (
      <div>
        {monitorStore.loading && <div>
          <article style={{minHeight: '80vh'}} aria-busy="true"></article>
        </div>}
        {!monitorStore.loading &&  <article>
          <header>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <div>
                <h2 style={{margin: 0, textAlign: 'center'}}>ETH Depegging Monitor</h2>
                <div style={{textAlign: 'left'}}>
                  <br/>
                  What would be the effect of ETH-PoW (ETH1) on L2 and alt-chains lending markets? <br/>
                Depending on the value of ETH1,
                it could impact the correctness of the L2 ETH price oracle, <br/>
                the DEX liquidity of $ETH, or both. Each affects the stability of lending markets.<br/>
                <a target="_blank" href="https://twitter.com/Risk_DAO/status/1555930512325238784">Learn more</a>
                </div>
              </div>
            </div>
          </header>
          <TableView data={monitorStore.prices}/>
          <footer style={{display: 'flex', justifyContent: 'space-around'}}>
            <a href="https://krystal.app" target="_blank">
              <img style={{  height:"72px" }} src={`/images/powered-by-kyberswap-${theme}.png`}/>
            </a>
          </footer>
        </article>}
      </div>
    )
  }
}

export default observer(EthMonitor)
