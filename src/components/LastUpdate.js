import React, { Component } from "react";
import moment from 'moment';

class LastUpdate extends Component {
  render () {
    const text = moment(this.props.timestamp * 1000).fromNow()
    return (
      <span>{text}</span>
    )
  }
}

export default LastUpdate;