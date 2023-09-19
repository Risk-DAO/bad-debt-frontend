import { LineChart, XAxis, YAxis, Legend, Line, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { largeNumberFormatter } from "../utils";
import moment from "moment/moment";

const strokes = {
    UNI: '#0088FE',
    WBTC: '#00C49F',
    WETH: '#FFBB28'
}


function timestampFormatter(timestamp){
    const formattedDate = moment(timestamp * 1000).format('l')
    return formattedDate;
}
function tooltipLabelFormatter(timestamp){
        const formattedDate = new Date(timestamp*1000);
    return formattedDate.toLocaleString();
}

/// blockinfo
// https://web3.api.la-tribu.xyz `/api/getblocktimestamp?blocknumber=${blockNumber}`

export default function CLFMarketGraph(props) {
    const { displayData, baseAsset, collaterals } = props;
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
                    <CartesianGrid vertical={false} horiz strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={timestampFormatter} tickMargin={35} angle={300}/>
                    <YAxis unit={` ${baseAsset}`} tickMargin={5} tickFormatter={largeNumberFormatter} />
                    <Tooltip labelFormatter={tooltipLabelFormatter} formatter={largeNumberFormatter} />
                    <Legend verticalAlign='top' />
                    {collaterals.map(_ => <Line key={_} type="monotone" stroke={strokes[_]} dataKey={_} activeDot={{ r: 8 }} />)}
                </LineChart> : <p>test</p>}
        </ResponsiveContainer>
    )
}