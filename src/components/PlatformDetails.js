import React, { Component } from "react";
import { observer } from "mobx-react";
import platformDetails from "../lending-platfroms-details/index";

class PlatformDetails extends Component {
  render () {
    const { name } = this.props
    const content = platformDetails[name]
    return (
      <div style={{padding: '5px'}}>
        {content()}
      </div>
    )
  }
}

export default observer(PlatformDetails)