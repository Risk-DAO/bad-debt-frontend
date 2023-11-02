import { Divider } from "@mui/material";
import { MathComponent } from "mathjax-react";

export default function CLFProtocolAverage(props) {
    const protocol = props.protocol;
    return (
        <div className="CLFMarket">
            <div className="CLFDataDisplay">
                <div className="CLFGraphContainer">
                    <div className="CLFMarketTabRow">
                        <article className="CLFProtocolNameTab">
                        {protocol.charAt(0).toUpperCase() + protocol.slice(1)}
                        </article>
                        <Divider orientation="vertical" />
                        <article className="CLFPoolNameTab">
                            Ethereum
                        </article>
                    </div>
                    <article className="CLFProtocolAverage">
                        <MathComponent tex={String.raw`r = \frac{\sigma \cdot \sqrt{d}}{\ln\frac{1}{(LTV + \beta)}*\sqrt{l}}`} />

                    </article>
                </div>
            </div>
        </div>
    )
}