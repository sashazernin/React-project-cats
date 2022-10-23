import './App.css';
import React from "react";
import RandomCat from "./components/RandomCat/RandomCat";
import {Route, Routes, Navigate, HashRouter} from "react-router-dom";
import Header from "./components/Header/Header";
import Vote from "./components/Vote/Vote";
import Favorites from "./components/Favorites/Favorites";
import Breeds from "./components/Breeds/Breeds";
import VotesList from "./components/VotesList/VotesList";

function App() {
    return (
        <HashRouter>
            <div className='appContainer'>
                <div className='app-body'>
                    <Header/>
                    <Routes>
                        <Route path='Breeds' element={<Breeds/>}/>
                        <Route path='' element={<Navigate to='/RandomCat'/>}/>
                        <Route path='RandomCat' element={<RandomCat/>}/>
                        <Route path='Favorites' element={<Favorites/>}/>
                        <Route path='Votes' element={<VotesList/>}/>
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
