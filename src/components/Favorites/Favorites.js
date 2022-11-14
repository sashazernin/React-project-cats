import React, {useState} from "react";
import c from './Favorites.module.css'
import {useSelector} from "react-redux";
import {getFavorites} from "../../features/slices/FavoritesSlice";
import Preloader from "../common/Preloader/Preloader";
import {useInitialize} from "../../features/hooks/useInitialize";
import ImagePopup from "../common/ImagePopup/ImagePopup";
import NullMessage from "../common/NullMessage/NullMessage";
import MessagePopup from "../common/ErrorMessage/messagePopup";
import {usePopupWithFavorite} from "../../features/hooks/usePopupWithFavorite";

const Favorites = () => {
    const favorites = useSelector(state => state.favorites.allFavorites)
    const SubscriberName = useSelector(state => state.Subscriber.SubscriberName)
    const [errorMessage, setErrorMessage] = useState()
    useInitialize(!favorites, getFavorites, [SubscriberName, setErrorMessage])
    const [popupOpened, setPopupOpened] = useState(false)
    const [popupData,openPopup,closePopup] = usePopupWithFavorite(setPopupOpened,setErrorMessage)
    if (!favorites) {return (<Preloader/>)}
    if (Object.entries(favorites).length === 0) {return (<NullMessage message={'No Favorites'}/>)}
    return (
        <div className={c.body}>
            <h1 className={c.title}>Favorites</h1>
            <div className={c.container}>
                <MessagePopup type={'error'} message={errorMessage} clear={() => {
                    setErrorMessage(null)
                }}/>
                <ImagePopup
                    popupData={popupData}
                    isOpened={popupOpened}
                    close={closePopup}
                />
                {[...favorites].reverse().map(f =>
                    <Favorite openPopup={openPopup} key={f.id} favoriteId={f.id} imageId={f.image_id}
                              imageUrl={f.image.url}/>
                )}
                <div className={c.item}>
                </div>
                <div className={c.item}>
                </div>
                <div className={c.item}>
                </div>
                <div className={c.item}>
                </div>
            </div>
        </div>
    )
}

const Favorite = (props) => {
    return (
        <div className={c.item}>
            <div className={c.favoriteButtonContainer}>
                <button className={c.favoriteButton}
                        onClick={() => {
                            props.openPopup(props.favoriteId, props.imageId, props.imageUrl, true,()=>{})
                        }}>
                </button>
            </div>
            {!!props.imageUrl ? <img className={c.favoriteImage} src={props.imageUrl} alt={'Cat'}/> :
                <span className={c.deleteImage}>This image has been deleted</span>}
        </div>
    )
}

export default Favorites