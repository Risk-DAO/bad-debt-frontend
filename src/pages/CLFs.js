import { Component } from "react";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";

class CLFs extends Component {

    constructor(props) {
      super(props);
    }
  
    render () {
    const urlParams = new URLSearchParams(window.location.search);
    const platform = urlParams.get('platform');
    const CLFsValues = mainStore.CLFs && mainStore.CLFs[platform];

    return(
        <div>
            <div className="clfTitle">Risk Appetite Index</div>
            <div className="clfSubtitle">The LTV Index tracks changes in Confidence Level Factor (CLF) values that reflect the confidence of a market in an asset to go through liquidation with no defaults. The higher the CLF the lower the recommended LTV of the asset should be.</div>
            <div className="clfBody"></div>
        </div>
    )
}
}

export default observer(CLFs);
