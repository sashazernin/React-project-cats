import React from "react";
import c from './Favorites.module.css'
import {useSelector} from "react-redux";
import {getFavorites} from "../../slices/FavoritesSlice";
import Preloader from "../common/Preloader/Preloader";
import Favorite from "./Favorite/Favorite";
import {useInitializePage} from "../../hooks/useInitializePage";

const Favorites = () => {
    const favorites = useSelector(state => state.favorites.allFavorites)
    const userId = useSelector(state => state.user.id)

    useInitializePage(!favorites, getFavorites, userId)

    if (!favorites) {
        return (
            <Preloader/>
        )
    }

    if (Object.entries(favorites).length === 0) {
        return (
            <div className={c.bodyNullMessage}>
                <span className={c.nullMessage}>
                    No favorites
                </span>
            </div>
        )
    }

    return (
        <div className={c.body}>
            {favorites.map(f =>
                <Favorite key={f.id} FavoriteId={f.id} catId={f.image_id} imageUrl={f.image.url}/>
            )}
            <div className={c.item}>
            </div>
            <div className={c.item}>
            </div>
            <div className={c.item}>
            </div>
            <div className={c.item}>
            </div>
            <div className={c.item}>
            </div>
            <div className={c.item}>
            </div>
        </div>
    )
}

export default Favorites