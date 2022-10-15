import React from "react";
import c from './Favorites.module.css'
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getFavorites} from "../../features/Favorites/FavoritesSlice";
import Preloader from "../Preloader/Preloader";
import Favorite from "./Favorite/Favorite";

const Favorites = () => {

    const dispatch = useDispatch()
    const favorites = useSelector(state => state.favorites.allFavorites)
    const userId = useSelector(state => state.user.id)

    useEffect(() => {
        async function startFetching() {

            await dispatch(getFavorites(userId))
        }

        if (Object.entries(favorites).length === 0) {
            startFetching();
        }
    }, [!favorites]);

    const favoriteId = useSelector(state => state.randomCat.favoriteId)

    if (Object.entries(favorites).length === 0) {
        return (
            <Preloader/>
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