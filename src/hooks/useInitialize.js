import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useToggling} from "./useToggling";

function useInitialize(condition, functionForInitialize, data) {

    const dispatch = useDispatch()
    const [call,toggleCall] = useToggling(true)
    useEffect(() => {

        if (condition && call) {
            dispatch(functionForInitialize(!!data && data))
            toggleCall()
        }
    }, [condition]);
}

export {useInitialize}