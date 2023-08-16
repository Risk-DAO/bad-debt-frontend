import React, { Component } from "react";
import { capitalizeFirstLetter } from "../utils";

class ChainIcon extends Component {
  render () {
    const chains = this.props.chain.split(",").map(c => c.toLowerCase()).filter(c => c)
    return (
      <div style={{display: "inline-block"}}>
        {chains.map((chain, i) => <img key={i} title={capitalizeFirstLetter(chain)} alt={chain} style={{borderRadius: '50%'}} src={`/images/chains/${chain}.webp`}/>)}
      </div>
    )
  }
}

export default ChainIcon;