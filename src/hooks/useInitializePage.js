import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useToggling} from "./useToggling";

function useInitializePage(condition, functionForInitialize, data) {
    const dispatch = useDispatch()
    const [call,toggleCall] = useToggling(false)
    useEffect(() => {
        async function startFetching() {
            await dispatch(functionForInitialize(!!data && data))
            toggleCall()
        }

        if (condition && !call) {
            startFetching();
        }
    }, [condition]);
}

export {useInitializePage}