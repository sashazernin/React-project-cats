import {useDispatch, useSelector} from "react-redux";
import {favoriteApi} from "../Api";
import {useState} from "react";
import {getFavorites} from "../slices/FavoritesSlice";

function useSwitchFavorite(imageId, favoriteId,isFavorite, setErrorMessage,setFavoriteId,) {
    const SubscriberName = useSelector(state => state.Subscriber.SubscriberName)
    const dispatch = useDispatch()
    const [inProcess, setInProcess] = useState(false)
    const addToFavorite = async () => {
        try {
            const resp = await favoriteApi.createAFavorite({
                'image_id': imageId,
                'sub_id': SubscriberName
            })
            if (resp.data.message === "SUCCESS") {
                dispatch(getFavorites([SubscriberName,setErrorMessage]))
                if (!!setFavoriteId) {
                    setFavoriteId(resp.data.id)
                }
                setInProcess(false)
            } else {
                setErrorMessage('Some error')
            }
        } catch (error) {
            setErrorMessage(error.message)
        }
    }

    const deleteFromFavorite = async () => {
        try {
            const resp = await favoriteApi.deleteFromFavorite(favoriteId)
            if (resp.data.message === "SUCCESS") {
                if (!!setFavoriteId) {
                    dispatch(getFavorites([SubscriberName,setErrorMessage]))
                    setFavoriteId(null)
                }
                setInProcess(false)
            } else {
                setErrorMessage('Some error')
            }
        } catch (error) {
            setErrorMessage(error.message)
        }
    }

    function switchFavorite() {
        if (!inProcess) {
            setInProcess(true)
            if (!isFavorite) {
                addToFavorite()
            } else {
                deleteFromFavorite()
            }
        }
    }

    return [switchFavorite]

}

export {useSwitchFavorite}