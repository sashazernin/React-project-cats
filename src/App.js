import './App.css';
import React from "react";
import RandomCat from "./components/RandomCat/RandomCat";
import {Route, Routes, Navigate, HashRouter} from "react-router-dom";
import Header from "./components/Header/Header";
import Vote from "./components/Vote/Vote";
import Favorites from "./components/Favorites/Favorites";
import Breeds from "./components/Breeds/Breeds";
import VotesList from "./components/VotesList/VotesList";
import {useDispatch, useSelector} from "react-redux";
import {getFavorites} from "./slices/FavoritesSlice";
import Preloader from "./components/common/Preloader/Preloader";

function App() {
    const dispatch = useDispatch()
    const userId = useSelector(state => state.user.id)
    const favorites = useSelector(state => state.favorites.allFavorites)
    if(!favorites){
        dispatch(getFavorites(userId))
        return <Preloader/>
    }
    return (
        <HashRouter>
            <div className={'appBody'}>
                <div className='appContainer'>
                    <div className='appContent'>
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
            </div>
        </HashRouter>
    );
}

export default App;
