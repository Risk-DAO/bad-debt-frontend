import React, { Component } from "react";

class PlatformIcon extends Component {

  constructor(props) {
    super(props);
  }

  render () {
    const platform = this.props.name.toLowerCase()
    return (
      <img style={{borderRadius: '50%', width: '24px', height: '24px'}} src={`/images/platforms/${platform}.webp`}/>
    )
  }
}

export default PlatformIcon;