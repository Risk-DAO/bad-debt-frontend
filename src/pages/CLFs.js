import { useEffect, useState } from "react";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import CLFMarket from "../components/CLFMarket";
import axios from "axios";
import { API_URL, removeSpaces, storeReversePlatformMapping } from "../utils";
import CLFProtocolAverage from "../components/CLFProtocolAverage";

function CLFs() {
    const urlParams = new URLSearchParams(window.location.search);
    const protocol = urlParams.get('protocol');
    let formattedProtocol = removeSpaces(protocol.toLowerCase());
    if(storeReversePlatformMapping[formattedProtocol]){
        formattedProtocol = storeReversePlatformMapping[formattedProtocol]
    }
    const loading = mainStore.CLFs ? false : true;
    const [graphData, setGraphData] = useState(undefined);
    const [averageData, setAverageData] = useState(undefined)


    useEffect(() => {
        async function getGraphData(protocol) {
            const apiResponseGraph = await axios.get(`${API_URL}/clf/getcurrentclfgraphdata?latest=true&platform=${protocol}`);
            const apiResponseAverages = await axios.get(`${API_URL}/clf/getcurrentaverageclfs?latest=true&platform=${protocol}`);
            setAverageData(apiResponseAverages.data);
            setGraphData(apiResponseGraph.data);
        }
        getGraphData(formattedProtocol);
    }, [formattedProtocol])
    return (
        <div style={{ margin: "0 2vw 0 2vw" }}>
            <div className="clfTitle">
                <h1 style={{ fontSize: "400%" }}>
                    Risk Level Index
                </h1>
            </div>
            <div className="clfSubtitle" style={{marginBottom:'5%'}}>
                <p style={{ color: "primary", fontSize: "150%", marginBottom: "4vh" }}>
                The Risk Level Index compares lending markets’ economic risk levels (<em>r</em>)  over time as they are being calculated by the <a href="https://medium.com/risk-dao/a-smart-contract-formula-for-ltv-ratio-a60a8373d54d" target="_blank" rel="noreferrer">SmartLTV formula.</a> Higher index values reflect a higher risk exposure which results from changes in market conditions without adjustments of LTV ratios of the market.
                </p>
                    <a target="_blank" rel="noreferrer" href="https://medium.com/risk-dao/announcing-the-risk-level-index-ca5dcef95303">
                <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                <button className="ReadMoreButton">Read More</button>
                </div>
                </a>
            </div>
            <hr style={{ marginBottom: "2%" }} />
            <CLFProtocolAverage protocol={protocol} averageData={averageData} />
            <hr style={{ marginBottom: "5%" }} />

            <div aria-busy={loading} className="clfBody">
                {graphData ? Object.entries(graphData).map(([k, v]) => <CLFMarket key={k} protocol={protocol} baseAsset={k} marketData={v} averageData={averageData[k]} graphData={graphData[k]} />) : loading ? `Loading ${protocol} data` : "No data to display."}
            </div>

        </div>
    )
}


export default observer(CLFs);
