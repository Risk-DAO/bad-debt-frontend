import React, { Component } from "react";
import {observer} from "mobx-react"
import mainStore from '../stores/main.store'
import marketsStore from '../stores/markets.store'

class DetailsForMarkets extends Component {

  constructor(props) {
    super(props);
  }

  render () {
    const { chain, platform, users, market } = this.props.data
    const name = 'subjob' + chain + '_' + platform + '_' + market + '.json'
    return (
      <a target="_blank" href={`https://raw.githubusercontent.com/Risk-DAO/simulation-results/main/${mainStore.headDirectory}/${mainStore.githubDirName}/${encodeURIComponent(name)}`}>{users.length} insolvent accounts</a>
    )
  }
}

export default observer(DetailsForMarkets)
