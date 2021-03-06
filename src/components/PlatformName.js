import React, { Component } from "react";
import {observer} from "mobx-react"

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const nameMaps = {
  "rari-capital": "Rari (Tetranode pool)",
  "rikki": "Rikkei Finance",
  "apeswap": "ApeSwap",
  "inverse": "Inverse Finance",
}

class PlatformName extends Component {

  constructor(props) {
    super(props);
  }

  render () {
    const displayName = nameMaps[this.props.name]
    const txt = !displayName ? this.props.name.split("-").map(capitalizeFirstLetter).join(" ") : displayName
    return (
      <span style={{marginLeft: '5px'}}>{txt}</span>
    )
  }
}

export default PlatformName;