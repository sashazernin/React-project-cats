import React, {useState} from "react";
import c from './Favorite.module.css'
import {useSwitchFavorite} from "../../../hooks/useSwitchFavorite";
import {deleteFromFavorite} from "../../../slices/FavoritesSlice";
import {useDispatch} from "react-redux";

const Favorite = (props) => {
    const [visible, setVisible] = useState('hidden')
    const [switchFavorite] = useSwitchFavorite(props.catId, props.FavoriteId)
    const dispatch = useDispatch()

    const deleteFavorite = async () => {
        await switchFavorite()
        dispatch(deleteFromFavorite(props.FavoriteId))
    }

    return (
        <div className={c.item}>
            <div className={c.favoriteButtonContainer}>
                <button className={c.favoriteButton}
                        onMouseEnter={() => {setVisible('visible')}}
                        onMouseLeave={() => {setVisible('hidden')}}
                        onClick={deleteFavorite}>
                    <span className={c.favoriteButtonText} style={{visibility: visible}}>
                        Delete from favorite
                    </span>
                </button>
            </div>
            <img className={c.favoriteImage} src={props.imageUrl}/>
        </div>
    )
}

export default Favorite