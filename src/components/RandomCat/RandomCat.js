import {useDispatch, useSelector} from "react-redux";
import {getRandomCat, setCat, setFavoriteId} from "../../features/slices/RandomCatSlice";
import c from './RandomCat.module.css'
import heart from "../../images/Heart.png";
import {useSwitchFavorite} from "../../features/hooks/useSwitchFavorite";
import heartActive from "../../images/HeartActive.png";
import {useInitialize} from "../../features/hooks/useInitialize";
import React, {useEffect, useState} from "react";
import {useCheckFavorite} from "../../features/hooks/useCheckFavorite";
import Preloader from "../common/Preloader/Preloader";
import MessagePopup from "../common/ErrorMessage/messagePopup";

const RandomCat = () => {
    const dispatch = useDispatch()
    const catImage = useSelector(state => state.randomCat.catUrl)
    const imageId = useSelector(state => state.randomCat.id)
    const [errorMessage, setErrorMessage] = useState()
    useInitialize(!catImage, true,getRandomCat, [setErrorMessage])
    const favoriteId = useSelector(state => state.randomCat.favoriteId)
    const [switchFavorite] = useSwitchFavorite(imageId, favoriteId, !!favoriteId, setErrorMessage, (id) => {
            dispatch(setFavoriteId(id))
        }
    )
    const [favoriteData, clear] = useCheckFavorite(imageId)
    useEffect(() => {
        dispatch(setFavoriteId(favoriteData.favoriteId))
    }, [favoriteData])
    return (
        <div className={c.body}>
            <MessagePopup type={'error'} message={errorMessage} clear={() => {
                setErrorMessage(null)
            }}/>
            <div className={c.cat}>
                {!catImage ? <Preloader/> :
                    <>
                        <img className={c.catImage} src={catImage}/>
                        <button className={c.favButton} onClick={() => {
                            switchFavorite()
                        }}>
                            <img className={c.favImage} src={!favoriteId ? heart : heartActive}/>
                        </button>
                    </>
                }
            </div>
            <div>
                <button className={c.newCatButton} onClick={() => {
                    clear()
                    dispatch(setFavoriteId(null))
                    dispatch(setCat({'url': null, 'id': null}))
                    dispatch(getRandomCat([setErrorMessage]))
                }}>Show me the cat!
                </button>
            </div>
        </div>
    )
}

export default RandomCat