import React, { Component, Fragment } from "react";
import { observer } from "mobx-react";
import ChainIcon from "./ChainIcon";
import PlatformDetails from "./PlatformDetails";
import LastUpdate from "./LastUpdate";
import WhaleFriendly from "./WhaleFriendly";
import DetailsForMarkets from "./DetailsForMarkets";
import marketsStore from "../stores/markets.store";
import mainStore from "../stores/main.store";
import NoDataFound from "./NoDataFound";

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

class MarketsTableView extends Component {
  render() {
    const data = this.props.data
    if(!data) {
      return <NoDataFound/>
    }
    const headTitleMap = {
      market: 'Market', 
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
    const totalTvl = body.reduce((a, b)=> a + Number(b.tvl), 0)
    const totalBadDebt = body.reduce((a, b)=> a + Number(b.total), 0)
    const totalInsolvent = body.reduce((a, b)=> a + Number(b.users.length), 0)
    const totalChains = [...new Set(body.map(({chain})=>chain))]


    const totalRatio = (totalBadDebt / totalTvl) * 100
    return (
      <div style={containerStyle}>
        <table role="grid">
        <thead>
        <tr>
            {head.map(v=> {
              if(!headTitleMap[v]){
                return null
              }
              if(sortable[v]){
                return (
                  <td className="clickable" key={v} onClick={()=>marketsStore.sortBy(v)}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                      <b>{headTitleMap[v]}</b>
                      <img alt="sort column" style={{maxWidth: '24px', filter: `invert(${mainStore.blackMode? 1 : 0})`}} src={'/images/sort.svg'}/>
                    </div>
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
        <tr style={{border: '5px solid'}}>
          <td>All markets</td>
          <td>
            {totalChains.map(chain=> <ChainIcon key={chain} chain={chain}/>)}
          </td>
          <td>$<WhaleFriendly num={totalTvl}/></td>
          <td>$<WhaleFriendly num={totalBadDebt}/></td>
          
          <td>{totalRatio.toFixed(2)}%</td>
          <td> </td>
          <td>{totalInsolvent} insolvent accounts</td>
        </tr>
          {body.map((row, index)=> <Fragment key={index}><tr>
            {Object.entries(row).map(([k, v], i) => {
              if (k === 'market'){
                return (<td key={v+i}>{v}</td>)
              }              
              if (k === 'chain'){
                return (<td key={v+i}><ChainIcon chain={v}/></td>)
              }
              if (k === 'tvl'){
                return (<td key={v+i}>$<WhaleFriendly num={v}/></td>)
              }                   
              if (k === 'total'){
                return (<td key={v+i}>$<WhaleFriendly num={v}/></td>)
              }         
              if (k === 'ratio'){
                return (<td key={v}>{v.toFixed(2)}%</td>)
              }            
              if (k === 'updated'){
                return (<td key={v+i}><LastUpdate timestamp={v}/></td>)
              }               
              if (k === 'users'){
                return (<td key={v+i}><DetailsForMarkets data={row}/></td>)
              }
              return ""           
            })}
          </tr>

          {row.platform === marketsStore.tableRowDetails && <tr><td colSpan='7'><PlatformDetails name={row.platform}/></td></tr>}
          </Fragment>)}

        </tbody>
        </table>
      </div>
    )
  }
}

export default observer(MarketsTableView)
