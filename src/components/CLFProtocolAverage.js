import { Divider, Tooltip as MUITooltip } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import { MathComponent } from "mathjax-react";
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CLFNumberFormatter } from "../utils";
import CircularProgress from '@mui/material/CircularProgress';
import moment from "moment";

export default function CLFProtocolAverage(props) {
    const protocol = props.protocol;
    const averageData = props.averageData;
    const [graphData, setGraphData] = useState(undefined);


    useEffect(() => {
        if (averageData && averageData['protocolAverageHistory']) {
            const data = [];
            for (const [timestamp, value] of Object.entries(averageData['protocolAverageHistory'])) {
                data.push({
                    'date': timestamp,
                    'weightedAverage': value
                })
            }
            data.sort((a, b) => a.date - b.date);
            setGraphData(data);
        }
    }, [averageData]);

    function xAxisFormat(timestamp) {
        const date = moment(Number(timestamp));
        const formattedDate = moment(date, "DD.MM.YYYY").format('MMM DD');
        return formattedDate
    }

    function RiskLevelNumberFormatter(number) {
        return [number.toFixed(2), 'Risk Level'];
    }


    return (
        <div className="CLFMarket">
            <div className="CLFDataDisplay">
                <div className="RiskProtocolGraphContainer">
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
                            <b><em>r</em> = {graphData ? graphData.slice(-1)[0]['weightedAverage'] : ''}</b>
                        </article>
                    </div>
                    <article className="CLFProtocolAverage" style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="RiskFormulaContainer" style={{maxWidth:'25vw'}}>
                            <div className="RiskFormula">
                                <MathComponent tex={String.raw`r = \frac{\sigma \cdot \sqrt{d}}{\ln\frac{1}{(LTV + \beta)}\cdot\sqrt{l}}`} />
                            </div>
                            <div className="RiskFormulaLegend" style={{ alignContent: 'flex-start', justifyContent: 'flex-start', textAlign: 'start' }}>
                                σ - Price volatility between the collateral and debt asset.<br />
                                β  - Liquidation bonus.<br />
                                ℓ - Available dex liquidity with a slippage of β.<br />
                                d - Debt cap of the borrowable asset.<br />
                                LTV - Loan to Value ratio.
                            </div>
                        </div>
                        <div className="CLFProtocolAverageGraph">
                            <div style={{ marginLeft: '5%' }}>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <MUITooltip title="Weighted average across all markets">
                                        <div style={{ display: "flex", flexDirection: "row" }}>
                                            <em style={{ marginRight: '10px' }}>r</em>
                                            <InfoIcon fontSize="small" />
                                        </div>
                                    </MUITooltip>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height="100%" minHeight="350px">
                                {graphData ?
                                    <LineChart
                                        data={graphData}
                                        margin={{
                                            top: 5,
                                            right: 0,
                                            left: 10,
                                            bottom: 60,
                                        }}
                                    >
                                        <CartesianGrid vertical={false} horiz strokeDasharray="3 3" />
                                        <XAxis dataKey="date" minTickGap={10} tickFormatter={xAxisFormat} />
                                        <YAxis type="number" tickMargin={5} tickFormatter={CLFNumberFormatter} />
                                        <Tooltip formatter={RiskLevelNumberFormatter} labelFormatter={xAxisFormat}
                                            wrapperClassName="card shadow" />
                                        <Line dot={false} key='weightedAverage' type="monotone" stroke={'#3182BD'} dataKey='weightedAverage' activeDot={{ r: 8 }} />
                                    </LineChart> : <CircularProgress />}
                            </ResponsiveContainer>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    )
}