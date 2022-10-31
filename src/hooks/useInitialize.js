import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useToggling} from "./useToggling";

function useInitialize(condition, functionForInitialize, data) {
    const dispatch = useDispatch()
    const [call,toggleCall] = useToggling(true)
    useEffect(() => {
        async function startFetching() {
            dispatch(functionForInitialize(!!data && data))
            toggleCall()
        }

        if (condition && call) {
            startFetching();
        }
    }, [condition]);
}

export {useInitialize}