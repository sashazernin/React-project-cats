import React, {useCallback, useEffect} from "react";
import c from './ImagePopup.module.css'
import heart from "../../../images/Heart.png";
import heartActive from "../../../images/HeartActive.png";
import {useToggling} from "../../../features/hooks/useToggling";

const ImagePopup = (props) => {
    const closePopup = (isFavorite) => {
        props.close(isFavorite)
    }
    const escPressed = useCallback((event) => {
        if(event.keyCode === 27){
            closePopup(isFavorite)
        }
    })
    useEffect(() => {
        document.addEventListener('keydown',escPressed)
        return () => {
            document.removeEventListener('keydown',escPressed)
        }
    },[escPressed])
    const [isFavorite, toggleIsFavorite] = useToggling(props.isFavorite)
    useEffect(() => {
        if(props.isFavorite !== isFavorite){
            toggleIsFavorite()
        }
    },[props.isOpened, props.isFavorite])
    return (
        <div onClick={() => {closePopup(isFavorite)}} style={{visibility: props.isOpened ? 'visible' : 'hidden'}} className={c.body}>
            <button className={c.cancelPopup}></button>
            <div onClick={(e)=>{e.stopPropagation()}} className={c.container}>
                {!!props.imageUrl ? <img className={c.image} src={props.imageUrl}/> : <span className={c.imageDelete}>This image has been deleted</span>}
                <div className={c.controlPanel}>
                    <button className={c.favButton} onClick={() => {toggleIsFavorite()}}>
                        <img className={c.favImage} src={isFavorite ? heartActive : heart}/>
                    </button>
                    {!!props.buttons && (Object.entries(props.buttons).length !== 0 && (props.buttons.map(button =>
                        <button key={button.name} onClick={()=>{button.onClickFunction(button.functionData)}}>
                            {button.name}
                        </button>
                    )))}
                </div>
            </div>
        </div>
    )
}

export default ImagePopup