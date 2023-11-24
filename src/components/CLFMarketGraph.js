import { LineChart, XAxis, YAxis, Legend, Line, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { CLFNumberFormatter, timestampFormatter, xAxisTimestampFormatter } from "../utils";
import { Box, Typography } from "@mui/material";

const strokes = {
    UNI: '#b03a78',
    WBTC: '#00C49F',
    WETH: '#FFBB28',
    cbETH: "#b24521",
    COMP: '#9c5e31',
    LINK: '#b791dc'
}

const CustomTooltip = ({ active, payload, label }) => {
    
    if (active && payload && payload.length) {
      const toDisplay = {};
      const collaterals = [];
      const colors = {};
      for(const index of payload){
        if(index['name']){
            collaterals.push(index['name']);
            toDisplay[index['name']] = index.payload;
            colors[index['name']] = index['color'];
        }
    }      
      return (
        <div className="card shadow">
            {collaterals.map(_ => <Box key={_} color={colors[_]} sx={{marginBottom:'10px'}}>
                <Typography>Date: {payload[0].payload.date}</Typography>
                <Typography color={colors[_]}>{_}: {toDisplay[_][`${_}`].toFixed(2)}</Typography>
                <Typography color={colors[_]}>{_} Liquidity: {toDisplay[_][`${_}-liquidity`].toFixed(2)}</Typography>
                <Typography color={colors[_]}>{_} Volatility: {toDisplay[_][`${_}-volatility`].toFixed(2)}</Typography>
                <Typography color={colors[_]}>Parameters:</Typography>
                <Typography color={colors[_]}>{_} LTV: {toDisplay[_][`${_}-parameters`]['LTV']}</Typography>
                <Typography color={colors[_]}>{_} Liquidation Bonus BPS: {toDisplay[_][`${_}-parameters`]['liquidationBonusBPS']}</Typography>
                <Typography color={colors[_]}>{_} SupplyCap: {toDisplay[_][`${_}-parameters`]['supplyCap']}</Typography>
            </Box>)}
        </div>
      );
    }
  }



export default function CLFMarketGraph(props) {
    const { displayData, collaterals, advanced } = props;
  return (
        <ResponsiveContainer width="100%" height="100%" minHeight="450px">
            {displayData ?
                <LineChart
                    data={displayData}
                    margin={{
                        top: 25,
                        right: 0,
                        left: 10,
                        bottom: 60,
                    }}
                >
                    <CartesianGrid vertical={false} horiz strokeDasharray="3 3" />
                    <XAxis dataKey="date" minTickGap={10} tickFormatter={xAxisTimestampFormatter} />
                    <YAxis type="number" label={{ value: 'r', offset: '45', position: 'top' }} tickMargin={5} tickFormatter={CLFNumberFormatter} />
                    {advanced ? 
                    <Tooltip content={CustomTooltip} payload={collaterals} formatter={CLFNumberFormatter} labelFormatter={timestampFormatter}
                    wrapperClassName="card shadow" />
                :
                <Tooltip formatter={CLFNumberFormatter} labelFormatter={timestampFormatter}
                        wrapperClassName="card shadow" />}
                    
                    <Legend verticalAlign='top' />
                    {collaterals.map(_ => <Line dot={false} key={_} type="monotone" stroke={strokes[_]} dataKey={_} activeDot={{ r: 8 }} />)}
                </LineChart> : <p>Failed to load data.</p>}
        </ResponsiveContainer>
    )
}