import { Component } from "react";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import CLFMarket from "../components/CLFMarket";

class CLFs extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const urlParams = new URLSearchParams(window.location.search);
        const protocol = urlParams.get('protocol');
        const CLFsValues = mainStore.CLFs ? mainStore.CLFs.filter((_ => _.protocol === protocol))[0] : undefined;
        console.log('CLFsValues', CLFsValues);
        return (
            <div style={{margin:"0 15vw 0 15vw"}}>
                <div className="clfTitle">
                    <h1>
                        Risk Appetite Index
                    </h1>
                </div>
                <div className="clfSubtitle">
                    <h5>
                        The LTV Index tracks changes in Confidence Level Factor (CLF) values that reflect the confidence of a market in an asset to go through liquidation with no defaults. The higher the CLF the lower the recommended LTV of the asset should be.
                    </h5>
                </div>
                <div className="clfBody">
                    {CLFsValues ? Object.entries(CLFsValues['results']).map(([k, v]) =><CLFMarket key={k} protocol={protocol} baseAsset={k} marketData={v} />) : "Could not load data" }
                </div>
                <div className="clfMethodology">
                    <article style={{display: "flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                        <div style={{display: "flex", width:"70%", flexDirection:"column", alignItems:"start", justifyContent:"space-evenly"}}>
                        <h2>Methodology</h2>
                        <sub>Methodology short text by Yaron</sub>
                        </div>
                        <button style={{width:"20%", height:"30%"}}>Read More</button>
                    </article>
                </div>
            </div>
        )
    }
}

export default observer(CLFs);
