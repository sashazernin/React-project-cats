import {useCheckFavorite} from "../../../features/hooks/useCheckFavorite";
import c from "../../Upload/Upload.module.css";
import React from "react";

const ImageWithCheckFavorite = (props) => {
    const [favoriteData, , setFavoriteData] = useCheckFavorite(props.imageId)
    return (
        <div className={c.item}>
            <div className={c.favoriteButtonContainer}>
                <button className={c.favoriteButton}
                        onClick={() => {
                            props.openPopup(
                                !!favoriteData.favoriteId && favoriteData.favoriteId,
                                props.imageId,
                                props.imageUrl,
                                favoriteData.isFavorite,
                                setFavoriteData
                            )
                        }}
                >
                </button>
            </div>
            <img className={c.favoriteImage} src={props.imageUrl}/>
        </div>
    )
}

export default ImageWithCheckFavorite