

import React, { Component } from "react";
import { observer } from "mobx-react";
import mainStore from "../stores/main.store";
import TableView from "../components/TableView";
import Hero from "../components/Hero";
import DaySelector from "../components/DaySelector";
class CompoundForksBadDebt extends Component {
  render () {
    const theme = mainStore.blackMode ? 'dark' : 'light';
    return (
      <div className="container page">
                <Hero/>
        <DaySelector/>
         <article>
          <header>
            <h2 style={{margin: 0, textAlign: 'center'}}>Lending Markets Bad Debt</h2>
          </header>
          {!mainStore.loading && <TableView data={mainStore.tableData}/>}
          {mainStore.loading && <div>
            <div style={{minHeight: '80vh'}} aria-busy="true"></div>
          </div>}
          <footer style={{display: 'flex', justifyContent: 'space-around'}}>
            <a href="https://krystal.app" target="_blank" rel="noreferrer">
              <img alt="kyber logo" style={{ width:"254px", height:"54px" }} src={`/images/power-krystal-${theme}.svg`}/>
            </a>
            <a href="https://zapper.fi" target="_blank" rel="noreferrer">
              <img alt="zapper logo" src={`/images/power-zapper-${theme}.svg`}/>
            </a>
          </footer>
        </article>
      </div>
    )
  }
}

export default observer(CompoundForksBadDebt);
