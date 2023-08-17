import React, { Component, useState } from "react";
import { observer } from "mobx-react";
import ChainIcon from "./ChainIcon";
import PlatformDetails from "./PlatformDetails";
import WhaleFriendly from "./WhaleFriendly";
import Details from "./Details";
import { capitalizeFirstLetter } from "../utils";
import mainStore from "../stores/main.store";
import moment from 'moment';
import platformDetails from "../lending-platfroms-details/index";
import NoDataFound from "./NoDataFound";
import { Tooltip } from "@mui/material";

const checkPlatformIcon = platform => {
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
const detailsStyle = {
  minWidth: '180px',
  padding: 0,
  margin: 0,
  border: 'none'

}
const summaryStyle = {
  padding: 0,
  margin: 0,
}
function Row(props){
  const row = props.data;
  const canOpen = platformDetails[row.platform];
  const [open, setOpen] = useState(false);
  const nameMaps = {
    "rari-capital": "Rari (Tetranode pool)",
    "rikki": "Rikkei Finance",
    "apeswap": "ApeSwap",
    "inverse": "Inverse Finance - frontier (deprecated)",
  }
  const displayName = nameMaps[row.platform]
  const name = !displayName ? row.platform.split("-").map(capitalizeFirstLetter).join(" ") : displayName
  if(row.platform === "compound v3"){
  console.log('row', row)
}
  return(
    <React.Fragment>
    <tr>
      <td>
        {canOpen ? <details style={detailsStyle}>
          <summary style={summaryStyle} onClick={()=> setOpen(!open)}>
          <img alt="platform logo" style={{borderRadius: '50%', width: '24px', height: '24px', display: 'inline'}} src={`/images/platforms/${row.platform.toLowerCase()}.webp`}/>
        <span style={{marginLeft: '5px'}}>{name}</span>
            </summary>
            </details>
        : 
        <div>
        <img alt="platform logo" style={{borderRadius: '50%', width: '24px', height: '24px', display: 'inline'}} src={`/images/platforms/${row.platform.toLowerCase()}.webp`}/>
        <span style={{marginLeft: '5px'}}>{name}</span>
        </div>
        }

      </td>
      <td>
        <ChainIcon chain={row.chain}/>
      </td>
      <td>
        $<WhaleFriendly num={row.tvl}/>
      </td>
      <td>
        $<WhaleFriendly num={row.total}/>
      </td>
      <td>
      {row.ratio.toFixed(2)}%
      </td>
      <td>
        {moment(row.updated * 1000).fromNow()}
      </td>
      <td>
        {row.clf && row.clf['weightedCLF'] ? <a href={`/clfs?protocol=${row.platform}`}>{row.clf['weightedCLF']}</a> : '-'}
      </td>
      <td>
        <Details data={row} />
      </td>
    </tr>
    {open ? <tr><td colSpan='7'><PlatformDetails name={row.platform}/></td></tr> :''}
    </React.Fragment>
  )
}

class TableView extends Component {
  render() {
    const data = this.props.data
    const headTitleMap = {
      platform: 'Name', 
      chain: 'Blockchain', 
      tvl: 'TVL', 
      total: 'Bad Debt', 
      ratio: 'Bad Debt Ratio', 
      updated: 'Last Update',
      clf: 'Avg. CLF',
      users: 'Details'
    }
    const body = data.filter(({platform})=> checkPlatformIcon(platform))
    if(body.length === 0) {
      return <NoDataFound/>
    }
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
              {head.map((v)=> {
                if(sortable[v]){
                  return (
                    <td className="clickable" key={v} onClick={()=>mainStore.sortBy(v)}>
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <b>{headTitleMap[v]}</b>
                          <img style={{maxWidth: '24px', filter: `invert(${mainStore.blackMode? 1 : 0})`}} src={'/images/sort.svg'} alt='Sort'/>
                      </div>
                    </td> 
                  )
                } 
                if(v === "clf"){
                  return(
                  <td key={v}>
                    <div style={{display:"flex", flexDirection:"row", alignItems:"start", justifyContent:"center"}}>
                      <b style={{marginRight:"3px"}}>{headTitleMap[v]}</b>
                        <Tooltip title="Explanation text goes here">
                        <img style={{maxWidth: '24px', filter: `invert(${mainStore.blackMode? 1 : 0})`}} src={'/images/tooltip.svg'} alt='tooltip'/>
                        </Tooltip>
                        </div>
                    </td> 
                    )
                }
                else {
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
            {body.map((row, i)=> <Row key={i} data={row} />)}
          </tbody>
        </table>
      </div>
    )
  }
}

export default observer(TableView)