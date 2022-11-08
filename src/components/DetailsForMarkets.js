import React, { Component } from "react";
import {observer} from "mobx-react"
import mainStore from '../stores/main.store'
import marketsStore from '../stores/markets.store'

class DetailsForMarkets extends Component {

  constructor(props) {
    super(props);
  }

  render () {
    const { chain, platform, users, market, sourceFile } = this.props.data
    return (
      <a target="_blank" href={`https://raw.githubusercontent.com/Risk-DAO/simulation-results/main/${mainStore.headDirectory}/${mainStore.githubDirName}/${encodeURIComponent(sourceFile)}`}>{users.length} insolvent accounts</a>
    )
  }
}

export default observer(DetailsForMarkets)
