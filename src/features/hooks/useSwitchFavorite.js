import {useDispatch, useSelector} from "react-redux";
import {favoriteApi} from "../Api";
import {useState} from "react";
import {getFavorites} from "../slices/FavoritesSlice";

export const OPTIMISTIC_FAVORITE_ID = "__optimistic__";

const getCreatedFavoriteId = (data) => {
    if (data && data.id != null) {
        return data.id
    }
    return null
}

const isDeleteFavoriteSuccess = (response) => {
    const status = response?.status
    if (status >= 200 && status < 300) {
        const message = response?.data?.message
        if (message == null || message === 'SUCCESS') {
            return true
        }
    }
    return false
}

function useSwitchFavorite(imageId, favoriteId, isFavorite, setErrorMessage, setFavoriteId) {
    const SubscriberName = useSelector(state => state.Subscriber.SubscriberName)
    const dispatch = useDispatch()
    const [inProcess, setInProcess] = useState(false)
    const [pop, setPop] = useState(false)

    const addToFavorite = async () => {
        const previousId = favoriteId
        if (setFavoriteId) {
            setFavoriteId(OPTIMISTIC_FAVORITE_ID)
        }
        try {
            const resp = await favoriteApi.createAFavorite({
                'image_id': imageId,
                'sub_id': SubscriberName
            })
            const createdId = getCreatedFavoriteId(resp.data)
            if (createdId != null) {
                dispatch(getFavorites([SubscriberName, 0, setErrorMessage]))
                if (setFavoriteId) {
                    setFavoriteId(createdId)
                }
            } else {
                if (setFavoriteId) {
                    setFavoriteId(previousId)
                }
                setErrorMessage('Some error')
            }
        } catch (error) {
            if (setFavoriteId) {
                setFavoriteId(previousId)
            }
            setErrorMessage(error.message)
        } finally {
            setInProcess(false)
        }
    }

    const deleteFromFavorite = async (idToDelete) => {
        const previousId = idToDelete
        if (setFavoriteId) {
            setFavoriteId(null)
        }
        try {
            const resp = await favoriteApi.deleteFromFavorite(idToDelete)
            if (isDeleteFavoriteSuccess(resp)) {
                dispatch(getFavorites([SubscriberName, 0, setErrorMessage]))
            } else {
                if (setFavoriteId) {
                    setFavoriteId(previousId)
                }
                setErrorMessage('Some error')
            }
        } catch (error) {
            if (setFavoriteId) {
                setFavoriteId(previousId)
            }
            setErrorMessage(error.message)
        } finally {
            setInProcess(false)
        }
    }

    function switchFavorite() {
        if (!inProcess) {
            setPop(true)
            setTimeout(() => setPop(false), 560)
            setInProcess(true)
            if (!isFavorite) {
                addToFavorite()
            } else if (favoriteId && favoriteId !== OPTIMISTIC_FAVORITE_ID) {
                deleteFromFavorite(favoriteId)
            } else {
                setInProcess(false)
            }
        }
    }

    return [switchFavorite, pop]
}

export {useSwitchFavorite}
