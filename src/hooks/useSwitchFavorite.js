import {useDispatch, useSelector} from "react-redux";
import {favoriteApi} from "../Api";
import {useState} from "react";

function useSwitchFavorite(catId, favoriteId, setFavoriteId) {
    const userId = useSelector(state => state.user.id)
    const dispatch = useDispatch()
    const [inProcess, setInProcess] = useState(false)
    const addToFavorite = async () => {
        try {
            const resp = await favoriteApi.createAFavorite({
                'image_id': catId,
                'sub_id': userId
            })
            if (resp.data.message === "SUCCESS") {
                setInProcess(false)
                if (!!setFavoriteId) {
                    dispatch(setFavoriteId(resp.data.id))
                }
            } else {
                alert('some Error')
            }
        } catch (error) {
            alert(error)
        }
    }

    const deleteFromFavorite = async () => {
        try {
            const resp = await favoriteApi.deleteFromFavorite(favoriteId)
            if (resp.data.message === "SUCCESS") {
                setInProcess(false)
                if (!!setFavoriteId) {
                    dispatch(setFavoriteId(null))
                }
            } else {
                alert('some Error')
            }
        } catch (error) {
            alert(error)
        }
    }

    function switchFavorite() {
        if (!inProcess) {
            setInProcess(true)
            if (!favoriteId) {
                addToFavorite()
            } else {
                deleteFromFavorite()
            }
        }
    }

    return [switchFavorite]

}

export {useSwitchFavorite}