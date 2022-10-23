import {useEffect} from "react";
import {useDispatch} from "react-redux";

function useInitializePage(condition, functionForInitialize, data) {
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