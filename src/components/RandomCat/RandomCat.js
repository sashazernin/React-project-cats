import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { getRandomCat} from "../../features/RandomCat/RandomCatSlice";
import c from './RandomCat.module.css'
import heart from "../../images/Heart.png";
import {useSwitchFavorite} from "../../hooks/useSwitchFavorite";
import {setFavoriteId} from "../../features/RandomCat/RandomCatSlice";
import heartActive from "../../images/HeartActive.png";


const RandomCat = () => {
    const dispatch = useDispatch()
    const catImage = useSelector(state => state.randomCat.catUrl)
    const catId = useSelector(state => state.randomCat.id)

    useEffect(() => {
        async function startFetching() {
            await dispatch(getRandomCat())
        }
        console.log('as')
        if (!catImage) {
            startFetching();
        }
    }, [!catImage]);

    const favoriteId = useSelector(state => state.randomCat.favoriteId)
    const [switchFavorite] = useSwitchFavorite(catId,favoriteId,setFavoriteId)

    return (
        <div className={c.body}>
            <div className={c.cat}>
                <img className={c.catImage} src={catImage}/>
                <button className={c.favButton}>
                    <img className={c.favImage} src={!favoriteId ? heart : heartActive} onClick={()=>{switchFavorite()}}/>
                </button>
            </div>
            <div>
                <button className={c.newCatButton} onClick={() => {
                    dispatch(getRandomCat())
                }}>Show me the cat!
                </button>
            </div>
        </div>
    )
}

export default RandomCat