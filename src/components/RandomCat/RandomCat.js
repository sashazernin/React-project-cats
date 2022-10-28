import {useDispatch, useSelector} from "react-redux";
import {getRandomCat, setCat, setFavoriteId} from "../../slices/RandomCatSlice";
import c from './RandomCat.module.css'
import heart from "../../images/Heart.png";
import {useSwitchFavorite} from "../../hooks/useSwitchFavorite";
import heartActive from "../../images/HeartActive.png";
import {useInitialize} from "../../hooks/useInitialize";
import React, {useEffect} from "react";
import {useCheckFavorite} from "../../hooks/useCheckFavorite";
import Preloader from "../common/Preloader/Preloader";

const RandomCat = () => {

    const dispatch = useDispatch()
    const catImage = useSelector(state => state.randomCat.catUrl)
    const imageId = useSelector(state => state.randomCat.id)
    useInitialize(!catImage, getRandomCat)
    const favoriteId = useSelector(state => state.randomCat.favoriteId)
    const [switchFavorite] = useSwitchFavorite(imageId, favoriteId,!!favoriteId, (id) => dispatch(setFavoriteId(id)))

    const [favoriteData, clear] = useCheckFavorite(imageId)
    useEffect(() => {
        dispatch(setFavoriteId(favoriteData.favoriteId))
    }, [favoriteData])
    return (
        <div className={c.body}>
            <div className={c.cat}>
                {!catImage ? <Preloader/> :
                    <>
                        <img className={c.catImage} src={catImage}/>
                        <button className={c.favButton} onClick={() => {switchFavorite()}}>
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
                    dispatch(getRandomCat())
                }}>Show me the cat!
                </button>
            </div>
        </div>
    )
}

export default RandomCat