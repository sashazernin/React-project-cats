import React, {useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getRandomCat} from "../../features/RandomCat/RandomCatSlice";
import c from './RandomCat.module.css'


const RandomCat = () => {
    const dispatch = useDispatch()
    const catImage = useSelector(state=>state.randomCat.catUrl)
    useEffect(() => {
        async function startFetching() {
            await dispatch(getRandomCat())
        }
        if(!catImage){
            startFetching();
        }
    }, [!catImage]);


return (
    <div className={c.body}>
        <div className={c.cat}>
            <img className={c.cat__image} src={catImage}/>
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