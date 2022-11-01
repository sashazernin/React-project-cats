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
            {!!props.imageUrl ? <img className={c.favoriteImage} src={props.imageUrl}/> : <span className={c.deleteImage}>This image has been deleted</span>}
        </div>
    )
}

export default Favorite