import React, {useState} from "react";
import c from './Favorites.module.css'
import {useDispatch, useSelector} from "react-redux";
import {deleteFromFavorite, getFavorites} from "../../features/slices/FavoritesSlice";
import Preloader from "../common/Preloader/Preloader";
import {useInitialize} from "../../features/hooks/useInitialize";
import ImagePopup from "../common/ImagePopup/ImagePopup";
import {useSwitchFavorite} from "../../features/hooks/useSwitchFavorite";
import NullMessage from "../common/NullMessage/NullMessage";
import MessagePopup from "../common/ErrorMessage/messagePopup";

const Favorites = () => {
    const favorites = useSelector(state => state.favorites.allFavorites)
    const SubscriberName = useSelector(state => state.Subscriber.SubscriberName)
    const [errorMessage,setErrorMessage] = useState()
    useInitialize(!favorites, getFavorites, [SubscriberName,setErrorMessage])
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

const Favorite = (props) => {
    return (
        <div className={c.item}>
            <div className={c.favoriteButtonContainer}>
                <button className={c.favoriteButton}
                        onClick={()=>{props.openImage(props.favoriteId,props.imageId,props.imageUrl,true)}}>
                </button>
            </div>
            {!!props.imageUrl ? <img className={c.favoriteImage} src={props.imageUrl}/> : <span className={c.deleteImage}>This image has been deleted</span>}
        </div>
    )
}

export default Favorites