import {useCheckFavorite} from "../../../features/hooks/useCheckFavorite";
import c from "../../Upload/Upload.module.css";
import catalog from "../../../styles/catalogGrid.module.css";
import React from "react";
import {TrashIcon} from "../ImagePopup/TrashIcon";

const ImageWithCheckFavorite = (props) => {
    const [favoriteData, , setFavoriteData] = useCheckFavorite(props.imageId)
    return (
        <div className={`${catalog.tile} ${c.item}`}>
            <div className={c.favoriteButtonContainer}>
                <button
                    type="button"
                    className={c.favoriteButton}
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
            {props.onRequestDelete && (
                <button
                    type="button"
                    className={c.tileDeleteBtn}
                    aria-label="Delete image"
                    onClick={(e) => {
                        e.stopPropagation()
                        props.onRequestDelete(props.imageId)
                    }}
                >
                    <TrashIcon className={c.tileDeleteIcon}/>
                </button>
            )}
            <img className={c.favoriteImage} src={props.imageUrl} alt=""/>
        </div>
    )
}

export default ImageWithCheckFavorite