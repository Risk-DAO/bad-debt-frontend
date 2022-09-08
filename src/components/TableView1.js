import React, { Component, Fragment } from "react";
import {observer} from "mobx-react"
import ChainIcon from "./ChainIcon";
import Platform from "./Platform";
import PlatformDetails from "./PlatformDetails";
import LastUpdate from "./LastUpdate";
import WhaleFriendly from "./WhaleFriendly";
import Details from "./Details";
import mainStore from "../stores/main.store";

const checkPlatformIcon = platform => {
  return true
  try{
    const icon = require(`../../public/images/platforms/${platform.toLowerCase()}.webp`)
    return icon
  } catch (e) {
    console.warn(platform.toLowerCase() + ".webp icon was not found")
    return null;
  }
}

const containerStyle = {
  overflowY: 'auto'
}

class TableView extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    debugger
    const data = this.props.data
    const body = data
    const head = Object.keys(body[0])

    return (
      <div style={containerStyle}>
        <table role="grid">
        <thead>
          <tr>
            {head.map(v=> {
              if(false){
                return (
                  <td className="clickable" key={v} onClick={()=>mainStore.sortBy(v)}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                      <b>{v}</b>
                      <img style={{maxWidth: '24px'}} src={'/images/sort.svg'}/>
                    </div>
                  </td> 
                )
              } else {
                if(['chain', 'buy', 'sell', 'mid'].indexOf(v) === -1){
                  return null
                }
                return (
                  <td key={v}>
                    <b style={{textTransform: 'capitalize'}}>{v}</b>
                  </td> 
                )
              }
            }
          )}
          </tr>
        </thead>
        {/* (6) ['buy', 'sell', 'mid', 'buyDeviation', 'sellDeviation', 'midDeviation'] */}
        <tbody>
          {body.map(row=> <Fragment key={row.platform}><tr>
            {Object.entries(row).map(([k, v])=> {
              if (k === 'chain'){
                return (<td key={k+v}><ChainIcon chain={v}/> <b style={{textTransform: 'capitalize'}}>{v}</b> </td>)
              }
              if (k === 'buy'){
                return (<td key={k+v}>${v.toFixed(2)} ({(row['buyDeviation'] *-1).toFixed(2)}%)</td>)
              }               
              if (k === 'sell'){
                return (<td key={k+v}>${v.toFixed(2)} ({(row['sellDeviation'] *-1).toFixed(2)}%)</td>)
              }                    
              if (k === 'mid'){
                return (<td key={k+v}>${v.toFixed(2)} ({(row['midDeviation'] *-1).toFixed(2)}%)</td>)
              }         
              return null     
            })}
          </tr>
          {row.platform === mainStore.tableRowDetails && <tr><td colSpan='7'><PlatformDetails name={row.platform}/></td></tr>}
          </Fragment>)}
        </tbody>
        </table>
      </div>
    )
  }
}

export default observer(TableView)