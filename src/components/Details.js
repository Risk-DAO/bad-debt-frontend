import React, { Component } from "react";
import {observer} from "mobx-react"
import mainStore from '../stores/main.store'
import marketsStore from '../stores/markets.store'

class Details extends Component {

  constructor(props) {
    super(props);
  }

  render () {
    const { chain, platform, users, markets } = this.props.data
    const name = chain + '_' + platform
    if(markets){
      return (
        <a href={`/markets?platform=${platform}`}>Full dashboard for {Object.values(markets).length} markets</a>
      )
    }
    return (
      <a target="_blank" href={`${mainStore.apiUrl}/bad-debt?platform=${name}`}>{users.length} insolvent accounts</a>
    )
  }
}

export default observer(Details)
