import React, { Component } from "react";
import {observer} from "mobx-react"
import mainStore from "../stores/main.store"

class DaySelector extends Component {

  render () {
    return (
      <div className="container" style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center'}}>
        <label key="date">
          <input type="date" id="date" name="date" onChange={mainStore.setSelectedDate} value={mainStore.selectedDate} min={mainStore.oldestDay} max={mainStore.today}/>
        </label>
      </div>
    )
  }
}

export default observer(DaySelector)