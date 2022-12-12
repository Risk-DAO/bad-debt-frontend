import React, { Component } from "react";
import {observer} from "mobx-react"
import mainStore from "../stores/main.store"

class Hero extends Component {

  constructor(props) {
    super(props);
  }

  render () {
    const color = mainStore.blackMode ? 'white' : 'black';
    return (
      <div className="container" style={{padding: '10vh 0 10vh 0', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center'}}>
        <a href="https://riskdao.org"><img style={{maxHeight: '10vh', maxWidth: '66vw'}} src={`/images/${color}-wordmark.png`}/></a>
      </div>
    )
  }
}

export default observer(Hero)