import {useEffect} from "react";
import {getFavorites} from "../features/Favorites/FavoritesSlice";
import {useDispatch} from "react-redux";


function useInitializePage(condition, functionForInitialize, data){
    console.log('a')
    const dispatch = useDispatch()
    useEffect(() => {
        async function startFetching() {
            await dispatch(functionForInitialize(!!data && data))
        }

        if (condition) {
            startFetching();
        }
    }, [condition]);
}

export {useInitializePage}