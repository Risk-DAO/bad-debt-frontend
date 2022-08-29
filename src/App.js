import '@picocss/pico'
import {observer} from "mobx-react"
import CompoundFroksBadDebt from "./pages/CompoundFroksBadDebt"
import Markets from "./pages/Markets"
import EthMonitor from "./pages/EthMonitor"
import Hero from './components/Hero'
import Footer from './components/Footer'
import './themeSwitcher'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";

function renderPage (props, PageComponent) {
  return (
    <PageComponent {...props}/> 
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <Hero/>
        <div className="container page">
            <Routes>
              {/* <Route exact path="/"  element={<CompoundFroksBadDebt/>}/> */}
              <Route exact path="/markets"  element={<Markets/>}/>
              <Route exact path="/"  element={<EthMonitor/>}/>
            </Routes>
        </div>
        <Footer/>
      </div>
    </Router>
  );
}

export default observer(App);
