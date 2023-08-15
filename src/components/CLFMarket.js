import { useState } from "react";


function Row(props){
    const name = props.tokenData[0];
    let CLFs = undefined;
    function formatCLF(clf){
        return (clf * 100).toFixed(2);
    }
    if(props.tokenData[1]){
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
    const collateral = props.collateral;
    const data = props.marketData.data;
    const protocol = props.protocol;
    const spans = [7, 30, 180];
    const [selectedVolatility, setSelectedVolatility] = useState(7);
    const [selectedLiquidity, setSelectedLiquidity] = useState(7);
    return (
        <div className="CLFMarket">
            <div className="CLFMarketButtonsRow">
                {/* protocol display */}
                <a href="" role="button" class="secondary">{protocol}</a>
                {/* pool display */}
                <a href="" role="button" class="secondary">{collateral}</a>
                {/* liquidity picker */}
                <label for="Liquidity"></label>
                <select onChange={(e)=>{setSelectedLiquidity(e.target.value)}} id="liquidity" required>
                    {spans.map(_ => <option value={_}>Avg. liquidity {_} days</option>)}
                </select>
                {/* liquidity picker */}
                <label for="Volatility"></label>
                <select onChange={(e)=>{setSelectedVolatility(e.target.value)}}  id="volatility" required>
                    {spans.map(_ => <option value={_}>Avg. volatility {_} days</option>)}
                </select>
            </div>
            <div className="CLFDataDisplay">
                <div className="CLFGraph">

                </div>
                <article className="CLFTable">
                    <table>
                        <thead>
                            <tr>
                            <td>Avg. CLF</td>
                            {spans.map(_=> <td>{_}</td>)}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(data).map(_=> <Row tokenData={_} />)}
                        </tbody>
                    </table>
                </article>
            </div>
        </div>
    )
    }