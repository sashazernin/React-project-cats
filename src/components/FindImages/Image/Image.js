import React, {useState} from "react";
import c from './Image.module.css'
import {useSwitchFavorite} from "../../../hooks/useSwitchFavorite";
import {deleteFromFavorite} from "../../../features/Favorites/FavoritesSlice";
import {useDispatch} from "react-redux";

const Breed = (props) => {
    const [visible, setVisible] = useState('hidden')
    const [switchFavorite] = useSwitchFavorite(props.catId, props.FavoriteId)
    const dispatch = useDispatch()

    return (
        <div className={c.item}>
            <img className={c.favoriteImage} src={props.imageUrl}/>
        </div>
    )
}

export default Breed