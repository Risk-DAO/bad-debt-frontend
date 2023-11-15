import '@picocss/pico'
import { observer } from "mobx-react"
import CompoundForksBadDebt from "./pages/CompoundForksBadDebt"
import Markets from "./pages/Markets"
import Footer from './components/Footer'
import './themeSwitcher'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import React from "react"
import Links from "./components/Links"
import CLFs from './pages/CLFs'

function App() {
  return (
    <Router>
      <div className="App">
        <Links/>
        <div>
            <Routes>
              <Route exact path="/"  element={<CompoundForksBadDebt/>}/>
              <Route exact path="/markets"  element={<Markets/>}/>
              <Route exact path="risk-index" element={<CLFs/>}/>
            </Routes>
        </div>
        <Footer/>
      </div>
    </Router>
  );
}

export default observer(App);
