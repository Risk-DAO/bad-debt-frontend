import { Divider, Tooltip as MUITooltip } from "@mui/material";
import { MathComponent } from "mathjax-react";
import InfoIcon from '@mui/icons-material/Info';
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
            if(averageData && averageData['protocolAverageHistory']){
                const data = [];
                for(const [timestamp, value] of Object.entries(averageData['protocolAverageHistory'])){
                    data.push({'date': timestamp,
                'weightedAverage': value})
                }
                data.sort((a,b)=> a.date - b.date);
                setGraphData(data);
    }}, [averageData]);

    function xAxisFormat(timestamp){
        const date = moment(Number(timestamp));
  const formattedDate = moment(date, "DD.MM.YYYY").format('MMM DD');
        return formattedDate
    }

    function RiskLevelNumberFormatter(number) {
        return [number.toFixed(2), 'Risk Level'];
      }

      console.log(averageData)

    return (
        <div className="CLFMarket">
            <div className="CLFDataDisplay">
                <div className="CLFGraphContainer">
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
                            <b><em>r</em> = {graphData.slice(-1)[0]['weightedAverage']}</b>
                        </article>
                    </div>
                    <article className="CLFProtocolAverage" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                        <div className="RiskFormula">
                            <MUITooltip title="Weighted average across all markets">
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <h6>Risk Level Index </h6>
                                    <Divider orientation="vertical" />
                                    <InfoIcon fontSize="small" />
                                </div>
                            </MUITooltip>
                            <MathComponent tex={String.raw`r = \frac{\sigma \cdot \sqrt{d}}{\ln\frac{1}{(LTV + \beta)}\cdot\sqrt{l}}`} />
                        </div>
                        <div className="CLFProtocolAverageGraph">
                            <ResponsiveContainer width="100%" height="100%" minHeight="350px">
                                {graphData ?
                                    <LineChart
                                    data={graphData}
                                    margin={{
                                        top: 25,
                                        right: 0,
                                        left: 10,
                                        bottom: 60,
                                    }}
                                >
                                    <CartesianGrid vertical={false} horiz strokeDasharray="3 3" />
                                    <XAxis dataKey="date" minTickGap={10} tickFormatter={xAxisFormat} />
                                    <YAxis type="number" label={{ value: 'r', offset: '45', position: 'top' }} tickMargin={5} tickFormatter={CLFNumberFormatter} />
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