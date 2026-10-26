import {useDispatch, useSelector} from "react-redux";
import {getRandomCat, setCat, setFavoriteId} from "../../features/slices/RandomCatSlice";
import c from './RandomCat.module.css'
import fav from '../../styles/favoriteButton.module.css'
import cta from '../../styles/primaryCta.module.css'
import heart from "../../images/Heart.png";
import {useSwitchFavorite} from "../../features/hooks/useSwitchFavorite";
import heartActive from "../../images/HeartActive.png";
import {useInitialize} from "../../features/hooks/useInitialize";
import React, {useEffect, useState} from "react";
import {useCheckFavorite} from "../../features/hooks/useCheckFavorite";
import Preloader from "../common/Preloader/Preloader";
import MessagePopup from "../common/ErrorMessage/messagePopup";
import layout from "../../styles/pageLayout.module.css";

const RandomCat = () => {
    const dispatch = useDispatch()
    const catImage = useSelector(state => state.randomCat.catUrl)
    const imageId = useSelector(state => state.randomCat.id)
    const [errorMessage, setErrorMessage] = useState()
    useInitialize(!catImage, true, getRandomCat, [setErrorMessage])
    const favoriteId = useSelector(state => state.randomCat.favoriteId)
    const [switchFavorite, favPop] = useSwitchFavorite(imageId, favoriteId, !!favoriteId, setErrorMessage, (id) => {
        dispatch(setFavoriteId(id))
    })
    const [favoriteData, clear] = useCheckFavorite(imageId)
    useEffect(() => {
        dispatch(setFavoriteId(favoriteData.favoriteId))
    }, [favoriteData,dispatch])
    return (
        <div className={`${layout.page} ${c.body}`}>
            <div className={layout.pageHead}>
                <h1 className={layout.pageTitle}>Random cat</h1>
            </div>
            <div className={c.container}>
                <MessagePopup type={'error'} message={errorMessage} clear={() => {
                    setErrorMessage(null)
                }}/>
                <div className={c.imageField}>
                    {!catImage ? <Preloader/> :
                        <>
                            <img className={c.catImage} src={catImage} alt={'Cat'}/>
                            <button
                                type="button"
                                className={`${fav.favBtn} ${fav.favBtnOverlay} ${favoriteId ? fav.favBtnActive : ''} ${favPop ? fav.favBtnPop : ''}`}
                                onClick={() => {
                                switchFavorite()
                            }}
                                aria-label={favoriteId ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                <img className={fav.favIcon} src={!favoriteId ? heart : heartActive} alt={''}/>
                            </button>
                        </>
                    }
                </div>
                <div>
                    <button type="button" className={cta.cta} onClick={() => {
                        clear()
                        dispatch(setFavoriteId(null))
                        dispatch(setCat({'url': null, 'id': null}))
                        dispatch(getRandomCat([setErrorMessage]))
                    }}>Show me the cat!
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RandomCat