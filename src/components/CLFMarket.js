export default function CLFMarket(props) {
    const collateral = props.collateral;
    const data = props.marketData;
    const protocol = props.protocol;



    return (
        <div className="CLFMarket">
            <div className="CLFMarketButtonsRow">
                {/* protocol display */}
                <article>{protocol}</article>
                {/* pool display */}
                <a href="" role="button" class="secondary">{collateral}</a>
                {/* liquidity picker */}
                <label for="Liquidity"></label>
                <select id="liquidity" required>
                    <option value="" selected>Select liquidity timespan</option>
                    <option>…</option>
                </select>
                {/* liquidity picker */}
                <label for="Volatility"></label>
                <select id="volatility" required>
                    <option value="" selected>Select volatility timespan</option>
                    <option>…</option>
                </select>
            </div>
        </div>
    )
}