import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useToggling} from "./useToggling";

function useInitialize(condition,usingDispatch, functionForInitialize, data) {
    const dispatch = useDispatch()
    const [call,toggleCall] = useToggling(true)
    useEffect(() => {

        if (condition && call) {
            console.log(condition)
            if(usingDispatch){
                dispatch(functionForInitialize(!!data && data))
            }else{
                functionForInitialize(!!data && data)
            }
            toggleCall()
        }
    }, [condition]);
}

export {useInitialize}