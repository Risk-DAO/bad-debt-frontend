import '@picocss/pico'
import {observer} from "mobx-react"
import CompoundForksBadDebt from "./pages/CompoundForksBadDebt"
import Markets from "./pages/Markets"
import Hero from './components/Hero'
import DaySelector from './components/DaySelector'
import Footer from './components/Footer'
import './themeSwitcher'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import Links from "./components/Links"
import CLFs from './pages/CLFs'

function renderPage (props, PageComponent) {
  return (
    <PageComponent {...props}/> 
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <Links/>
        <Hero/>
        <DaySelector/>
        <div className="container page">
            <Routes>
              <Route exact path="/"  element={<CompoundForksBadDebt/>}/>
              <Route exact path="/markets"  element={<Markets/>}/>
              <Route exact path="clfs" element={<CLFs/>}/>
            </Routes>
        </div>
        <Footer/>
      </div>
    </Router>
  );
}

export default observer(App);
