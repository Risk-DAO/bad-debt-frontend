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
  try{
    const icon = require(`../../public/images/platforms/${platform.toLowerCase()}.webp`)
    return icon
  } catch (e) {
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
    const data = this.props.data
    const headTitleMap = {
      platform: 'Name', 
      chain: 'Blockchain', 
      tvl: 'TVL', 
      total: 'Bad Debt', 
      ratio: 'Bad Debt Ratio', 
      updated: 'Last Update', 
      users: 'Details'
    }
    const body = data.filter(({platform})=> checkPlatformIcon(platform))
    const head = Object.keys(body[0])
    const sortable = {
      tvl: true, 
      total: true, 
      ratio: true, 
      updated: true, 
    }
    return (
      <div style={containerStyle}>
        <table role="grid">
        <thead>
          <tr>
            {head.map(v=> {
              if(sortable[v]){
                return (
                  <td className="clickable" key={v} onClick={()=>mainStore.sortBy(v)}>
                    <b>{headTitleMap[v]}</b>
                  </td> 
                )
              } else {
                return (
                  <td key={v}>
                    <b>{headTitleMap[v]}</b>
                  </td> 
                )
              }
            }
          )}
          </tr>
        </thead>
        <tbody>
          {body.map(row=> <Fragment key={row.platform}><tr>
            {Object.entries(row).map(([k, v])=> {
              if (k === 'platform'){
                return (<td key={v}><Platform name={v}/></td>)
              }
              if (k === 'chain'){
                return (<td key={v}><ChainIcon chain={v}/></td>)
              }
              if (k === 'tvl'){
                return (<td key={v}>$<WhaleFriendly num={v}/></td>)
              }                   
              if (k === 'total'){
                return (<td key={v}>$<WhaleFriendly num={v}/></td>)
              }                 
              if (k === 'ratio'){
                return (<td key={v}>{v.toFixed(2)}%</td>)
              }                  
              if (k === 'updated'){
                return (<td key={v}><LastUpdate timestamp={v}/></td>)
              }               
              if (k === 'users'){
                return (<td key={v}><Details data={row}/></td>)
              }            
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