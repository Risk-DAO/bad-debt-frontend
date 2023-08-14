import { Component } from "react";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import CLFMarket from "../components/CLFMarket";
import { dummyData } from "../stores/dummyData";

class CLFs extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const urlParams = new URLSearchParams(window.location.search);
        const platform = urlParams.get('platform');
        const CLFsValues = mainStore.CLFs && mainStore.CLFs[platform];

        return (
            <div>
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
                    {dummyData ? Object.entries(dummyData['compound v3']['pools']).map(([k, v]) =><CLFMarket protocol="CompoundV3" collateral={k} marketData={v} />) : "Could not load data" }
                </div>
            </div>
        )
    }
}

export default observer(CLFs);
