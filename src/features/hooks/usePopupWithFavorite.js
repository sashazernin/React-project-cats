import {deleteFromFavorite} from "../slices/FavoritesSlice";
import {useState} from "react";
import {useSwitchFavorite} from "./useSwitchFavorite";
import {useDispatch} from "react-redux";

function usePopupWithFavorite(setPopupOpened, setErrorMessage) {
    const dispatch = useDispatch()
    const [popupData, setPopupData] = useState({
        'favoriteId': null,
        'imageId': null,
        'imageUrl': null,
        'isFavorite': false,
        'setFavoriteData': null,
    })

    function openPopup(favoriteId, imageId, imageUrl, isFavorite, setFavoriteData) {
        setPopupData({...popupData, favoriteId, imageId, imageUrl, isFavorite, setFavoriteData})
        setPopupOpened(true)
    }

    const closePopup = async (isFavorite) => {
        setPopupOpened(false)
        if (isFavorite !== popupData.isFavorite && !popupData.inProcess) {
            await switchFavorite()
            if (!isFavorite) {
                dispatch(deleteFromFavorite(popupData.favoriteId))
            }
        }
    }
    const [switchFavorite] = useSwitchFavorite(
        popupData.imageId,
        popupData.favoriteId,
        popupData.isFavorite,
        setErrorMessage,
        (id) => {
            popupData.setFavoriteData({'isFavorite': !popupData.isFavorite, 'favoriteId': id})
        }
    )
    return [popupData, openPopup, closePopup]
}

export {usePopupWithFavorite}