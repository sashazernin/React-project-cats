import {useDispatch, useSelector} from "react-redux";
import {favoriteApi} from "../Api";

function useSwitchFavorite(catId, favoriteId, setFavoriteId) {
    const userId = useSelector(state => state.user.id)
    const dispatch = useDispatch()

    const addToFavorite = async () => {
        try {
            const resp = await favoriteApi.createAFavorite({
                'image_id': catId,
                'sub_id': userId
            })
            if (resp.data.message === "SUCCESS") {
                if (!!setFavoriteId) {
                    dispatch(setFavoriteId(resp.data.id))
                }
            } else {
                alert('some Error')
            }
        } catch(error) {
            alert(error)
        }
    }

    const deleteFromFavorite = async () => {
        try {
            const resp = await favoriteApi.deleteFromFavorite(favoriteId)
            if (resp.data.message === "SUCCESS") {
                if (!!setFavoriteId) {
                    dispatch(setFavoriteId(null))
                }
            } else {
                alert('some Error')
            }
        } catch(error) {
            alert(error)
        }
    }

    function switchFavorite() {
        if (!favoriteId) {
            addToFavorite()
        } else {
            deleteFromFavorite()
        }
    }

    return [switchFavorite]

}

export {useSwitchFavorite}