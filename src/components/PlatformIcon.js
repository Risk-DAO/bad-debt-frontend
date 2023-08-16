import React, { Component } from "react";

class PlatformIcon extends Component {
  render () {
    const platform = this.props.name.toLowerCase()
    return (
      <img alt="platform icon" style={{borderRadius: '50%', width: '24px', height: '24px', display: 'inline'}} src={`/images/platforms/${platform}.webp`}/>
    )
  }
}

export default PlatformIcon;