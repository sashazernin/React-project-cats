import React, {useState} from "react";
import c from './Favorites.module.css'
import {useDispatch, useSelector} from "react-redux";
import {deleteFromFavorite, getFavorites} from "../../slices/FavoritesSlice";
import Preloader from "../common/Preloader/Preloader";
import Favorite from "./Favorite/Favorite";
import {useInitialize} from "../../hooks/useInitialize";
import ImagePopup from "../common/ImagePopup/ImagePopup";
import {useSwitchFavorite} from "../../hooks/useSwitchFavorite";
import NullMessage from "../common/NullMessage/NullMessage";
import MessagePopup from "../common/ErrorMessage/messagePopup";

const Favorites = () => {
    const favorites = useSelector(state => state.favorites.allFavorites)
    const userId = useSelector(state => state.user.id)
    const [errorMessage,setErrorMessage] = useState()
    useInitialize(!favorites, getFavorites, [userId,setErrorMessage])
    const dispatch = useDispatch()
    const [popupOpened, setPopupOpened] = useState(false)
    const [popupData, setPopupData] = useState({'favoriteId': null, 'imageId': null, 'imageUrl': null})
    const [switchFavorite] = useSwitchFavorite(popupData.imageId, popupData.favoriteId,!!popupData.favoriteId,setErrorMessage)

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
            <NullMessage message={'No Favorites'}/>
        )
    }
    return (
        <div className={c.body}>
            <MessagePopup type={'error'} message={errorMessage} clear={()=>{setErrorMessage(null)}} />
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