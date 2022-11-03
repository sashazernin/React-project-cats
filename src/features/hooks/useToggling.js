import {useState} from "react";


function useToggling(initialValue){
    const [value,setValue] = useState(initialValue)
    function toggleValue(){
        setValue(!value)
    }
    return[value,toggleValue]
}

export {useToggling}