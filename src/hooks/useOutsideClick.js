import {useEffect, useRef} from "react";

function useOutsideClick(opened, close){
    const ref = useRef(null)

    const handleClick = (e) => {
        if(!ref.current.contains(e.target)){
            close()
        }
    }

    useEffect(() => {
        if(opened){
            document.addEventListener('click', handleClick)
            return () => {
                document.removeEventListener('click', handleClick)
            }
        }
    },[opened])

    return [ref]
}

export {useOutsideClick}