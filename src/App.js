import '@picocss/pico'
import {observer} from "mobx-react"
import CompoundFroksBadDebt from "./pages/CompoundFroksBadDebt"
import Markets from "./pages/Markets"
import Hero from './components/Hero'
import DaySelector from './components/DaySelector'
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
        <DaySelector/>
        <div className="container page">
            <Routes>
              <Route exact path="/"  element={<CompoundFroksBadDebt/>}/>
              <Route exact path="/markets"  element={<Markets/>}/>
            </Routes>
        </div>
        <Footer/>
      </div>
    </Router>
  );
}

export default observer(App);
