import {useSelector} from "react-redux";
import {useEffect, useState} from "react";

function useCheckFavorite(imageId){
    const favorites = useSelector(state => state.favorites.allFavorites)
    const [favoriteData,setFavoriteData] = useState({'isFavorite':false,'favoriteId':null})
    useEffect(()=>{
        if(!!imageId){
            if(!!favorites && favoriteData.id !== imageId){
                favorites.forEach(item => item.image_id === imageId && setFavoriteData({'isFavorite':true,'favoriteId':item.id}))
            }
        }
    },[imageId])
    const clear = () => {
        setFavoriteData({'isFavorite':false,'favoriteId':null})
    }
    return [favoriteData,clear,setFavoriteData]
}

export {useCheckFavorite}