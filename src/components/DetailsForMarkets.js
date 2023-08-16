import React, { Component } from "react";
import { observer } from "mobx-react";
import mainStore from '../stores/main.store';

class DetailsForMarkets extends Component {
  render () {
    const {users, sourceFile } = this.props.data
    return (
      <a target="_blank" href={`https://raw.githubusercontent.com/Risk-DAO/simulation-results/main/${mainStore.headDirectory}/${mainStore.githubDirName}/${encodeURIComponent(sourceFile)}`} rel="noreferrer">{users.length} insolvent accounts</a>
    )
  }
}

export default observer(DetailsForMarkets)
