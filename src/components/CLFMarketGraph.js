import { LineChart, XAxis, YAxis, Legend, Line, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { CLFNumberFormatter, timestampFormatter, xAxisTimestampFormatter } from "../utils";

const strokes = {
    UNI: '#b03a78',
    WBTC: '#00C49F',
    WETH: '#FFBB28',
    cbETH: "#b24521",
    COMP: '#9c5e31',
    LINK: '#b791dc'
}





export default function CLFMarketGraph(props) {
    const { displayData, collaterals } = props;
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
                    <Tooltip formatter={CLFNumberFormatter} labelFormatter={timestampFormatter}
                        wrapperClassName="card shadow" />
                    <Legend verticalAlign='top' />
                    {collaterals.map(_ => <Line dot={false} key={_} type="monotone" stroke={strokes[_]} dataKey={_} activeDot={{ r: 8 }} />)}
                </LineChart> : <p>Failed to load data.</p>}
        </ResponsiveContainer>
    )
}