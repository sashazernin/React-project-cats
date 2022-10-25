import React from "react";
import c from './Favorite.module.css'

const Favorite = (props) => {
    return (
        <div className={c.item}>
            <div className={c.favoriteButtonContainer}>
                <button className={c.favoriteButton}
                        onClick={()=>{props.openImage(props.favoriteId,props.imageId,props.imageUrl,true)}}>
                </button>
            </div>
            <img className={c.favoriteImage} src={props.imageUrl}/>
        </div>
    )
}

export default Favorite