import './App.css';
import React from "react";
import RandomCat from "./components/RandomCat/RandomCat";
import {Route, Routes, Navigate, HashRouter} from "react-router-dom";
import Header from "./components/Header/Header";
import Vote from "./components/Vote/Vote";
import Favorites from "./components/Favorites/Favorites";
import VotesList from "./components/VotesList/VotesList";
import {useDispatch, useSelector} from "react-redux";
import {getFavorites} from "./features/slices/FavoritesSlice";
import Preloader from "./components/common/Preloader/Preloader";
import FindImage from "./components/FindImage/FindImage";
import Upload from "./components/Upload/Upload";
import MessagePopup from "./components/common/ErrorMessage/messagePopup";
import {useState} from "react";
import {useInitialize} from "./features/hooks/useInitialize";
import {setSubscriberName} from "./features/slices/SubscriberSlice";
import About from "./components/About/About";

function App() {
    const dispatch = useDispatch()
    const subscriberName = useSelector(state => state.Subscriber.SubscriberName)
    const favorites = useSelector(state => state.favorites.allFavorites)
    const [errorMessage, setErrorMessage] = useState()
    const checkAndSetSubscriberName = () => {
        if (localStorage.getItem('subscriberName') !== null) {
            dispatch(setSubscriberName(localStorage.getItem('subscriberName')))
        } else {
            dispatch(setSubscriberName('publicSubscriber'))
        }
    }
    const initializeApp = async () => {
        if (subscriberName === null) {
            checkAndSetSubscriberName()
        } else {
            dispatch(getFavorites([subscriberName, setErrorMessage]))
        }
    }
    useInitialize([!subscriberName, !favorites], false, initializeApp)
    return (
        <HashRouter>
            <div className={'appBody'}>
                <div className='appContainer'>
                    <div className='appContent'>
                        <MessagePopup type={'error'} message={errorMessage} clear={() => {
                            setErrorMessage(null)
                        }}/>
                        {!favorites ? <Preloader/> :
                            <>
                                <Header/>
                                <Routes>
                                    <Route path='About' element={<About/>}/>
                                    <Route path='FindImage' element={<FindImage/>}/>
                                    <Route path='Upload' element={<Upload/>}/>
                                    <Route path='' element={<Navigate to='/RandomCat'/>}/>
                                    <Route path='RandomCat' element={<RandomCat/>}/>
                                    <Route path='Favorites' element={<Favorites/>}/>
                                    <Route path='Votes' element={<VotesList/>}/>
                                    <Route path='Vote' element={<Vote/>}/>
                                </Routes>
                            </>
                        }
                    </div>
                </div>
            </div>
        </HashRouter>
    );
}

export default App;
