import { useEffect, useState } from "react";
import CLFMarketGraph from "./CLFMarketGraph";


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
    const spans = [7, 30, 180];
    const [selectedVolatility, setSelectedVolatility] = useState(7);
    console.log(selectedVolatility);
    const [selectedLiquidity, setSelectedLiquidity] = useState(7);

    const [displayData, setDisplayData] = useState([]);
    const collaterals = [];
    for (const [k, v] of Object.entries(data)) {
        if (v) {
            collaterals.push(k)
        }
    };


    useEffect(()=> {
        if(data){
            const firstToken = Object.keys(data)[0];
            const timestampArray = [];
            const sortedData = [];
            for(const blockNumber in data[firstToken]["liquidityHistory"][selectedLiquidity]){
                timestampArray.push(blockNumber);
            }
            for(const timestamp of timestampArray){
                const toPush = {};
                for(const [collateral, collateralValues] of Object.entries(data)){
                    toPush['timestamp'] = timestamp;
                    toPush[collateral] = collateralValues.liquidityHistory[selectedLiquidity][timestamp];
                }
                sortedData.push(toPush);
            }
            setDisplayData(sortedData);
        }
    }, [data, selectedLiquidity])





    if (!display) {
        return
    }
    return (
        <div className="CLFMarket">
            <div className="CLFMarketButtonsRow">
                {/* protocol display */}
                <button className="secondary outline">{protocol.charAt(0).toUpperCase() + protocol.slice(1)}</button>
                {/* pool display */}
                <button className="secondary outline">{baseAsset} Market</button>
                {/* liquidity picker */}
                <select onChange={(e) => { setSelectedLiquidity(e.target.value) }} id="liquidity" required>
                    {spans.map(_ => <option key={_} value={_}>Avg. Liquidity Over {_}D</option>)}
                </select>
                {/* liquidity picker */}
                <select onChange={(e) => { setSelectedVolatility(e.target.value) }} id="volatility" required>
                    {spans.map(_ => <option key={_} value={_}>Avg. Volatility Over {_}D</option>)}
                </select>
            </div>
            <div className="CLFDataDisplay">
                <article className="CLFGraph">
                    <CLFMarketGraph baseAsset={baseAsset} collaterals={collaterals} displayData={displayData} />
                </article>
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
        </div>
    )
}