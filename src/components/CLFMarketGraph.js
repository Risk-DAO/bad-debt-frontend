import { LineChart, CartesianGrid, XAxis, YAxis, Legend, Line, ResponsiveContainer, Tooltip } from "recharts";
import { largeNumberFormatter } from "../utils";

const strokes = {
    UNI: '#0088FE',
    WBTC: '#00C49F',
    WETH: '#FFBB28'
}


/// blockinfo
// https://web3.api.la-tribu.xyz `/api/getblocktimestamp?blocknumber=${blockNumber}`

export default function CLFMarketGraph(props) {
    const { displayData, baseAsset, collaterals } = props;
    console.log(displayData)
    return (
        <ResponsiveContainer width="100%" height="100%" minHeight="400px">
            {displayData ?
                <LineChart
                    data={displayData}
                    margin={{
                        top: 5,
                        right: 0,
                        left: 60,
                        bottom: 60,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="blockNumber" tickMargin={15} label={{ value: 'block number', position: 'bottom', offset: '7' }} />
                    <YAxis unit={` ${baseAsset}`} tickMargin={5} tickFormatter={largeNumberFormatter} />
                    <Tooltip formatter={largeNumberFormatter} />
                    <Legend verticalAlign='top' />
                    {collaterals.map(_ => <Line key={_} type="monotone" stroke={strokes[_]} dataKey={_} activeDot={{ r: 8 }} />)}
                </LineChart> : <p>test</p>}
        </ResponsiveContainer>
    )
}