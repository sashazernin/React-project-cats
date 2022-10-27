import {useEffect, useRef} from "react";

function useOutsideClick(isOpened, close){
    const ref = useRef(null)

    const handleClick = (e) => {

        if(!ref.current.contains(e.target)){
            close()
        }
    }

    useEffect(() => {
        console.log(ref)
        if(isOpened){
            document.addEventListener('click', handleClick)
            return () => {
                document.removeEventListener('click', handleClick)
            }
        }
    },[isOpened])

    return [ref]
}

export {useOutsideClick}