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
    const name = chain + '_' + platform + '_' + market
    return (
      <a target="_blank" href={`${mainStore.apiUrl}/bad-debt-sub-jobs?market=${name}`}>{users.length} insolvent accounts</a>
    )
  }
}

export default observer(DetailsForMarkets)
