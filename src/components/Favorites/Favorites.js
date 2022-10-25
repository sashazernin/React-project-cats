import React, {useState} from "react";
import c from './Favorites.module.css'
import {useDispatch, useSelector} from "react-redux";
import {deleteFromFavorite, getFavorites} from "../../slices/FavoritesSlice";
import Preloader from "../common/Preloader/Preloader";
import Favorite from "./Favorite/Favorite";
import {useInitializePage} from "../../hooks/useInitializePage";
import ImagePopup from "../common/ImagePopup/ImagePopup";
import {useSwitchFavorite} from "../../hooks/useSwitchFavorite";

const Favorites = () => {
    const favorites = useSelector(state => state.favorites.allFavorites)
    const userId = useSelector(state => state.user.id)
    useInitializePage(!favorites, getFavorites, userId)
    const dispatch = useDispatch()
    const [popupOpened, setPopupOpened] = useState(false)
    const [popupData, setPopupData] = useState({'favoriteId': null, 'imageId': null, 'imageUrl': null})
    const [switchFavorite] = useSwitchFavorite(popupData.imageId, popupData.favoriteId,!!popupData.favoriteId)

    function openPopup(favoriteId, imageId, imageUrl,isFavorite) {
        setPopupData({favoriteId, imageId, imageUrl,isFavorite})
        setPopupOpened(true)
    }

    function closePopup(isFavorite) {
        setPopupOpened(false)
        if (!isFavorite) {
            switchFavorite()
            dispatch(deleteFromFavorite(popupData.favoriteId))
        }
    }

    if (!favorites) {
        return (
            <Preloader/>
        )
    }
    if (Object.entries(favorites).length === 0) {
        return (
            <div className={c.bodyNullMessage}>
                <span className={c.nullMessage}>
                    No favorites
                </span>
            </div>
        )
    }
    return (
        <div className={c.body}>
            <ImagePopup
                isFavorite={popupData.isFavorite}
                isOpened={popupOpened}
                close={closePopup}
                favoriteId={popupData.favoriteId}
                imageId={popupData.imageId}
                imageUrl={popupData.imageUrl}
            />
            {[...favorites].reverse().map(f =>
                <Favorite openImage={openPopup} key={f.id} favoriteId={f.id} imageId={f.image_id} imageUrl={f.image.url}/>
            )}
            <div className={c.item} >
            </div>
            <div className={c.item} >
            </div>
            <div className={c.item} >
            </div>
            <div className={c.item} >
            </div>
            <div className={c.item} >
            </div>
            <div className={c.item} >
            </div>
        </div>
    )
}

export default Favorites