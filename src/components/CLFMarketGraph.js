import { LineChart, XAxis, YAxis, Legend, Line, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import moment from "moment/moment";

const strokes = {
    UNI: '#b03a78',
    WBTC: '#00C49F',
    WETH: '#FFBB28',
    cbETH: "#b24521",
    COMP: '#9c5e31',
    LINK: '#b791dc'
}


function timestampFormatter(date) {
    const formattedDate = moment(date, "DD.MM.YYYY").format('l')
    return formattedDate;
}

function CLFNumberFormatter(number) {
    return number.toFixed(2);
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
                        left: 60,
                        bottom: 60,
                    }}
                >
                    <CartesianGrid vertical={false} horiz strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickMargin={35} angle={300} tickFormatter={timestampFormatter} />
                    <YAxis type="number" domain={[0, 1]} label={{ value: 'CLF', offset: '45', position: 'top' }} tickMargin={5} tickFormatter={CLFNumberFormatter} />
                    <Tooltip formatter={CLFNumberFormatter}
                        wrapperClassName="card shadow" />
                    <Legend verticalAlign='top' />
                    {collaterals.map(_ => <Line dot={false} key={_} type="monotone" stroke={strokes[_]} dataKey={_} activeDot={{ r: 8 }} />)}
                </LineChart> : <p>Failed to load data.</p>}
        </ResponsiveContainer>
    )
}