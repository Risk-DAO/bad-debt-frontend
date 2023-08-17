import { LineChart, CartesianGrid, XAxis, YAxis, Legend, Line, ResponsiveContainer, Tooltip } from "recharts";
import mainStore from "../stores/main.store";
import { largeNumberFormatter, roundTo } from "../utils";

const strokes = {
    UNI: '#0088FE',
    WBTC: '#00C49F',
    WETH: '#FFBB28'
}

export default function CLFMarketGraph(props) {
    const { baseAsset, market, span } = props;
    const loading = mainStore.loading;
    const displayData = [];
    const slippage = 5;
    const timestamps = mainStore.timestamps;
    const collaterals = [];
    for (const [k, v] of Object.entries(market)) {
        if (v) {
            collaterals.push(k)
        }
    };
    if (!loading) {
        const graphData = mainStore.graphData;
        const volumeData = {};
        const dataForDexForSpan = graphData['uniswapv3'][span];
        for (const collateral of collaterals) {
            const dataForDexForSpanForCollateral = dataForDexForSpan.filter(_ => _.base.toLowerCase() === collateral.toLowerCase());
            for (const coll of dataForDexForSpanForCollateral) {
                for (const volumeForSlippage of coll.volumeForSlippage) {
                    const blockNumber = volumeForSlippage.blockNumber;
                    const slippageValue = volumeForSlippage.aggregated[slippage];
                    if (!volumeData[blockNumber]) {
                        volumeData[blockNumber] = {};
                    }
                    if (!volumeData[blockNumber][collateral]) {
                        volumeData[blockNumber][collateral] = 0;
                    }
                    volumeData[blockNumber][collateral] += slippageValue;
                }
            }
        }
        for (const [blockNumber, quotesData] of Object.entries(volumeData)) {
            const toPush = {};
            toPush['blockNumber'] = blockNumber;
            toPush['timestamp'] = timestamps[span][blockNumber];
            for (const [quote, slippageValue] of Object.entries(quotesData)) {
                toPush[quote] = roundTo(slippageValue);
            }
            displayData.push(toPush);
        }

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
                        <Tooltip />
                        <Legend verticalAlign='top' />
                        {collaterals.map(_ => <Line key={_} type="monotone" stroke={strokes[_]} dataKey={_} activeDot={{ r: 8 }} />)}
                    </LineChart> : <p>test</p>}
            </ResponsiveContainer>
        )
    }
}