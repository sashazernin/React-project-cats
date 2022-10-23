import React from "react";
import c from './Breed.module.css'

const Breed = (props) => {

    return (
        <div className={c.item}>
            <img className={c.favoriteImage} src={props.imageUrl}/>
        </div>
    )
}

export default Breed