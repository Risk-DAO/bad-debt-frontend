import { useEffect, useState } from "react";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import CLFMarket from "../components/CLFMarket";
import axios from "axios";
import { API_URL } from "../utils";
import { MathComponent } from "mathjax-react";

function CLFs() {
    const urlParams = new URLSearchParams(window.location.search);
    const protocol = urlParams.get('protocol');
    const CLFsValues = mainStore.CLFs ? mainStore.CLFs.filter((_ => _.protocol === protocol))[0] : undefined;
    const loading = mainStore.CLFs ? false : true;
    const [graphData, setGraphData] = useState(undefined);
    const [averageData, setAverageData] = useState(undefined)


    useEffect(() => {
        async function getGraphData(protocol) {
            const apiResponseGraph = await axios.get(`${API_URL}/getcurrentclfgraphdata?platform=${protocol}&latest=true`);
            const apiResponseAverages = await axios.get(`${API_URL}/getcurrentaverageclfs?platform=${protocol}&latest=true`);
            setAverageData(apiResponseAverages.data);
            setGraphData(apiResponseGraph.data);
        }
        getGraphData('compoundv3');
    }, [])
    return (
        <div style={{ margin: "0 2vw 0 2vw" }}>
            <div className="clfTitle">
                <h1 style={{ fontSize: "400%" }}>
                    Risk Level Index
                </h1>
            </div>
            <div className="clfSubtitle">
                <p style={{ color: "primary", fontSize: "150%", marginBottom: "4vh" }}>
                The Risk Level Index compares lending markets’ economic risk levels (<em>r</em>) over time as they are being calculated by the <a href="https://medium.com/risk-dao/a-smart-contract-formula-for-ltv-ratio-a60a8373d54d" target="_blank" rel="noreferrer">SmartLTV formula.</a>
                <br/>
Higher <em>r</em> values reflect a higher risk exposure which results from changes in market conditions without adjustments of LTV ratios of the market.
                </p>

            </div>
            <hr style={{ marginBottom: "2%" }} />
            <div className="clfMethodology">
                <article style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{display:"flex", width:"100%", justifyContent:'center'}}>
                    <MathComponent tex={String.raw`r = \frac{\sigma * \sqrt{d}}{\ln\frac{1}{(LTV + \beta)}*\sqrt{l}}`} />
                    </div>
                    <div style={{ display: "flex", width: "90%", flexDirection: "column", alignItems: "start", justifyContent: "space-evenly" }}>
                        <h2>Methodology</h2>
                        <sub>Methodology short text by Yaron</sub>
                    </div>
                <div style={{display:"flex", width:"100%", justifyContent:'flex-end'}}>
                    <button style={{ width: "20%", height: "30%" }}>Read More</button>
                    </div>
                </article>
            </div>
            <hr style={{ marginBottom: "2%" }} />

            <div aria-busy={loading} className="clfBody">
                {CLFsValues ? Object.entries(CLFsValues['results']).map(([k, v]) => <CLFMarket key={k} protocol={protocol} baseAsset={k} marketData={v} averageData={averageData[k]} graphData={graphData[k]} />) : loading ? `Loading ${protocol} data` : "No data to display."}
            </div>

        </div>
    )
}


export default observer(CLFs);
