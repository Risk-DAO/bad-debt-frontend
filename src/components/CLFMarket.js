import { useEffect, useState } from "react";
import CLFMarketGraph from "./CLFMarketGraph";
import { Divider } from "@mui/material";


function Row(props) {
    const name = props.tokenData[0];
    let CLFs = undefined;
    function formatCLF(clf) {
        if(clf === "N/A" || clf === undefined){
            return "N/A"
        }
        const computedClf = (clf * 100).toFixed(2);
        return computedClf > 100 ? 100 : computedClf;
    }
    if (props.tokenData[1]) {
        CLFs = props.tokenData[1]['clfs'];
    }
    return <tr>
        <td>
            {name}
        </td>
        <td>
            {CLFs ? formatCLF(CLFs['7']['7']) : "N/A"}
        </td>
        <td>
            {CLFs ? formatCLF(CLFs['30']['30']) : "N/A"}
        </td>
        <td>
            {CLFs ? formatCLF(CLFs['180']['180']) : "N/A"}
        </td>
    </tr>
}

export default function CLFMarket(props) {
    const baseAsset = props.baseAsset;
    const data = props.marketData.collateralsData;
    const display = props.marketData.totalCollateral > 0 ? true : false;
    const protocol = props.protocol;
    const graphData = props.graphData;
    const spans = [7, 30, 180];
    const [selectedVolatility, setSelectedVolatility] = useState(7);
    const [selectedLiquidity, setSelectedLiquidity] = useState(7);
    const [selectedGraphData, setSelectedGraphData] = useState(undefined);
    const collaterals = [];
    for (const [k, v] of Object.entries(data)) {
        if (v) {
            collaterals.push(k)
        }
    };

console.log(selectedGraphData);
useEffect(()=> {
    setSelectedGraphData(graphData[selectedVolatility][selectedLiquidity].toReversed());
}, [selectedVolatility, selectedLiquidity, graphData])



    if (!display) {
        return
    }
    return (
        <div className="CLFMarket">
            <div className="CLFDataDisplay">
                <div className="CLFGraphContainer">
                    <div className="CLFMarketButtonsRow">
            <div className="CLFMarketButtonsContainer">
                {/* liquidity picker */}
                <select style={{fontSize:"0.75rem", maxWidth:"40%"}}  className="secondary outline" onChange={(e) => { setSelectedLiquidity(e.target.value) }} id="liquidity" required>
                    {spans.map(_ => <option key={_} value={_}>Avg. Liquidity Over {_}D</option>)}
                </select>
                {/* volatility picker */}
                <select style={{fontSize:"0.75rem", maxWidth:"40%"}}  className="secondary outline" onChange={(e) => { setSelectedVolatility(e.target.value) }} id="volatility" required>
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
                    {baseAsset} Market
                    </article>
                    </div>
                <article className="CLFGraph">
                    <CLFMarketGraph baseAsset={baseAsset} collaterals={collaterals} displayData={selectedGraphData} />
                </article>
                </div>
                <article className="CLFTable">
                    <table>
                        <thead>
                            <tr>
                                <td>Avg. CLF</td>
                                {spans.map(_ => <td key={_}>{_}D</td>)}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(data).map(_ => <Row key={_} tokenData={_} />)}
                        </tbody>
                    </table>
                </article>
            </div>
            <hr/>
        </div>
    )
}