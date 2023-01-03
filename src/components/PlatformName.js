import { Component } from "react";
import { capitalizeFirstLetter } from "../utils";

const nameMaps = {
  "rari-capital": "Rari (Tetranode pool)",
  "rikki": "Rikkei Finance",
  "apeswap": "ApeSwap",
  "inverse": "Inverse Finance - frontier (deprecated)",
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