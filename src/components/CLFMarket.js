import { useEffect, useState } from "react";
import CLFMarketGraph from "./CLFMarketGraph";
import { Divider } from "@mui/material";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

function Row(props) {
    const name = props.tokenData[0];
    let CLFs = props.tokenData[1];
    function formatCLF(clf) {
        if(clf === "N/A" || clf === undefined){
            return "N/A"
        }
        return clf.toFixed(2);
    }
    return <tr>
        <td>
            {name}
        </td>
        <td>
            {CLFs['7D_averageSpan'][props.selectedLiquidity] ? formatCLF(CLFs['7D_averageSpan'][props.selectedVolatility][props.selectedLiquidity]) : "N/A"}
        </td>
        <td>
            {CLFs['30D_averageSpan'][props.selectedLiquidity] ? formatCLF(CLFs['30D_averageSpan'][props.selectedVolatility][props.selectedLiquidity]) : "N/A"}
        </td>
        <td>
            {CLFs['180D_averageSpan'][props.selectedLiquidity] ? formatCLF(CLFs['180D_averageSpan'][props.selectedVolatility][props.selectedLiquidity]) : "N/A"}
        </td>
    </tr>
}

export default function CLFMarket(props) {
    const baseAsset = props.baseAsset;
    const data = props.marketData.collateralsData;
    const display = props.marketData.totalCollateral > 0 ? true : false;
    const protocol = props.protocol;
    const graphData = props.graphData;
    const averagesTableData = props.averageData;
    const spans = [7, 30, 180];
    const [selectedVolatility, setSelectedVolatility] = useState(30);
    const [selectedLiquidity, setSelectedLiquidity] = useState(30);
    const [selectedGraphData, setSelectedGraphData] = useState(undefined);
    const [selectedCollaterals, setSelectedCollaterals] = useState([]);
    const [availableCollaterals, setAvailableCollaterals] = useState([]);
    const urlParams = new URLSearchParams(window.location.search);
    const advanced = urlParams.get('advanced');
    

useEffect(()=> {
    setSelectedGraphData(graphData[selectedVolatility][selectedLiquidity].toReversed());
}, [selectedVolatility, selectedLiquidity, graphData]);
useEffect(()=> {
    const collaterals = [];
    for (const [k, v] of Object.entries(data)) {
        if (v) {
            collaterals.push(k)
        }
    };
    setAvailableCollaterals(collaterals);
    setSelectedCollaterals(collaterals);
}, [data]);

function updateCollaterals(collateral){
    if(selectedCollaterals.includes(collateral)){
        if(selectedCollaterals.length === 1){
            return
        }
        const updatedCollaterals = selectedCollaterals.filter(_ => _ !== collateral);
        setSelectedCollaterals(updatedCollaterals);
    }
    else{
        setSelectedCollaterals([...selectedCollaterals, collateral])
    }
}
    if (!display) {
        return
    }
    return (
        <div className="CLFMarket">
            <div className="CLFDataDisplay">
                <div className="CLFGraphContainer">
                    <div className="CLFMarketButtonsRow">
            <div className="CLFMarketButtonsContainer">
                {/* <IOSSwitch checked={showAdvancedControls} onChange={()=>setShowAdvancedControls(!showAdvancedControls)}/> */}
                {/* liquidity picker */}
                <select style={{fontSize:"0.75rem", maxWidth:"50%"}} value={selectedLiquidity}  className="secondary outline" onChange={(e) => { setSelectedLiquidity(e.target.value) }} id="liquidity" required>
                    {spans.map(_ => <option key={_} value={_}>Avg. Liquidity Over {_}D</option>)}
                </select>
                {/* volatility picker */}
                <select style={{fontSize:"0.75rem", maxWidth:"50%"}} value={selectedVolatility}  className="secondary outline" onChange={(e) => { setSelectedVolatility(e.target.value) }} id="volatility" required>
                    {spans.map(_ => <option key={_} value={_}>Avg. Volatility Over {_}D</option>)}
                </select>
            </div>
            </div>
            <div className="CLFMarketTabRow">
                    <article className="CLFProtocolNameTab">
                    {protocol.charAt(0).toUpperCase() + protocol.slice(1)}
                    </article>
                    <Divider orientation="vertical" />
                    <article className="CLFPoolNameTab">
                    Ethereum
                    </article>
                    <Divider orientation="vertical" />
                    <article className="CLFPoolNameTab">
                    {baseAsset} Market
                    </article>
                    </div>
                <article className="CLFGraph">
                    <div>
                    <FormGroup
          sx={{all:"unset"}}
          >
        
          {advanced ? availableCollaterals.map(collateral => <FormControlLabel className="collateralsControls" key={collateral} control={<Checkbox color="primary" checked={selectedCollaterals.includes(collateral)} onChange={() => updateCollaterals(collateral)} />} label={collateral} />) : ''}
          </FormGroup>
                    </div>
                    <CLFMarketGraph baseAsset={baseAsset} advanced={advanced} collaterals={selectedCollaterals} displayData={selectedGraphData} />
                </article>
                </div>
                <div className="CLFTableContainer">
                    <div className="CLFTableOffset"/>
                <article className="CLFTable">
                    <table>
                        <thead>
                            <tr>
                                <td>Avg. Risk Levels</td>
                                {spans.map(_ => <td key={_}>{_}D</td>)}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(averagesTableData).map(_ => <Row selectedLiquidity={selectedLiquidity} selectedVolatility={selectedVolatility} key={_} tokenData={_} />)}
                        </tbody>
                    </table>
                </article>
                </div>
            </div>
            <hr/>
        </div>
    )
}