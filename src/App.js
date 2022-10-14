import './App.css';
import React from "react";
import RandomCat from "./components/RandomCat/RandomCat";
import {Route, Routes, BrowserRouter, Navigate, HashRouter} from "react-router-dom";
import Header from "./components/Header/Header";
import Vote from "./components/Vote/Vote";

function App() {
    return (
        <HashRouter>
            <div className="app-wrapper">
                <div className='wrapper' ></div>
                <div className='app-body'>
                    <Header/>
                    <Routes>
                        <Route path='' element={<Navigate to='/RandomCat' />}/>
                        <Route path='RandomCat' element={<RandomCat/>}/>
                        <Route path='Vote' element={
                            <Vote/>
                        }/>
                    </Routes>

                </div>
            </div>
        </HashRouter>
    );
}

export default App;
