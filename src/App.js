import logo from './logo.svg';
import './App.css';
import React from "react";
import RandomCat from "./components/RandomCat/RandomCat";
import {Route, Routes, BrowserRouter,Navigate} from "react-router-dom";
import Header from "./components/Header/Header";

function App() {
    return (
        <BrowserRouter>
            <div className="app-wrapper">
                <div className='app-body'>
                    <Header/>
                    <Routes>
                        <Route path='' element={<Navigate to='/RandomCat' />}/>
                        <Route path='RandomCat' element={<RandomCat/>}/>
                    </Routes>

                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
