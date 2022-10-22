import React from "react";
import preloader from '../../../images/Preloader.gif'
import c from './Preloader.module.css'

const Preloader = () => {
    return(
        <div className={c.body}>
            <img className={c.preloaderImage} src={preloader}/>
        </div>
    )
}

export default Preloader
