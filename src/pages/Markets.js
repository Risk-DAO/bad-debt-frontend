

import React, { Component } from "react";
import {observer} from "mobx-react"
import marketsStore from "../stores/markets.store"
import MarketsTableView from "../components/MarketsTableView";
import PlatformIcon from "../components/PlatformIcon";

class CompoundFroksBadDebt extends Component {

  constructor(props) {
    super(props);
  }

  render () {
    console.log(marketsStore.loading)
    return (
      <div>
        {marketsStore.loading && <div>
          <article style={{minHeight: '80vh'}} aria-busy="true"></article>
        </div>}
        {!marketsStore.loading &&  <article>
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <PlatformIcon name={'MIM'}/> 
            <h2 style={{margin: '10px', textAlign: 'center'}}>MIM Bad Debt</h2>
          </header>
          <MarketsTableView data={marketsStore.tableData}/>
          <footer style={{display: 'flex', justifyContent: 'space-around'}}>
          </footer>
        </article>}
      </div>
    )
  }
}

export default observer(CompoundFroksBadDebt)