import React, {useCallback, useEffect, useState} from "react";
import c from './ImagePopup.module.css'
import fav from '../../../styles/favoriteButton.module.css'
import heart from "../../../images/Heart.png";
import heartActive from "../../../images/HeartActive.png";
import {useToggling} from "../../../features/hooks/useToggling";
import {TrashIcon} from "./TrashIcon";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

const ImagePopup = (props) => {
    const closePopup = (isFavorite) => {
        props.close(isFavorite)
    }
    const [isFavorite, toggleIsFavorite] = useToggling(props.popupData.isFavorite)
    const [favPop, setFavPop] = useState(false)
    const [confirmButton, setConfirmButton] = useState(null)

    const escPressed = useCallback((event) => {
        if (event.keyCode === 27) {
            if (confirmButton) {
                setConfirmButton(null)
                return
            }
            props.close(isFavorite)
        }
    }, [confirmButton, isFavorite, props.close])

    useEffect(() => {
        document.addEventListener('keydown', escPressed)
        return () => {
            document.removeEventListener('keydown', escPressed)
        }
    }, [escPressed])

    useEffect(() => {
        if (!props.isOpened) {
            setConfirmButton(null)
        }
    }, [props.isOpened])

    useEffect(() => {
        if (props.popupData.isFavorite !== isFavorite) {
            toggleIsFavorite()
        }
    }, [props.isOpened, props.popupData.isFavorite])

    const actionButtons = props.buttons?.length ? props.buttons : []

    const runAction = (button) => {
        button.onClickFunction(button.functionData)
    }

    const handleActionClick = (button) => {
        if (button.confirm) {
            setConfirmButton(button)
            return
        }
        runAction(button)
    }

    const handleConfirm = () => {
        if (!confirmButton) {
            return
        }
        runAction(confirmButton)
        setConfirmButton(null)
    }

    const renderActionLabel = (button) => {
        if (button.icon === 'trash') {
            return <TrashIcon className={c.trashIcon}/>
        }
        return button.name
    }

    return (
        <div onClick={() => {
            if (confirmButton) {
                return
            }
            closePopup(isFavorite)
        }} style={{visibility: props.isOpened ? 'visible' : 'hidden'}} className={c.body}>
            <button
                type="button"
                className={c.cancelPopup}
                aria-label="Close"
                onClick={(e) => {
                    e.stopPropagation()
                    if (confirmButton) {
                        setConfirmButton(null)
                        return
                    }
                    closePopup(isFavorite)
                }}
            />
            <div onClick={(e) => {
                e.stopPropagation()
            }} className={c.container}>
                {!!props.popupData.imageUrl ? <img className={c.image} src={props.popupData.imageUrl} alt=""/> :
                    <span className={c.imageDelete}>This image has been deleted</span>}
                <div className={c.controlPanel}>
                    <button
                        type="button"
                        className={`${fav.favBtn} ${c.controlPanelFav} ${isFavorite ? fav.favBtnActive : ''} ${favPop ? fav.favBtnPop : ''}`}
                        onClick={() => {
                            setFavPop(true)
                            setTimeout(() => setFavPop(false), 560)
                            toggleIsFavorite()
                        }}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <img className={`${fav.favIcon} ${c.controlPanelFavIcon}`} src={isFavorite ? heartActive : heart} alt={''}/>
                    </button>
                    {actionButtons.length > 0 && (
                        <div className={c.panelActions}>
                            {actionButtons.map((button) => {
                                const isIconDanger = button.icon && button.variant === 'danger'
                                const variantClass = isIconDanger
                                    ? c.actionBtnDangerIcon
                                    : button.variant === 'danger'
                                        ? c.actionBtnDanger
                                        : c.actionBtnNeutral
                                return (
                                <button
                                    type="button"
                                    key={button.name}
                                    className={`${c.actionBtn} ${button.icon ? c.actionBtnIcon : ''} ${variantClass}`}
                                    onClick={() => handleActionClick(button)}
                                    aria-label={button.name}
                                >
                                    {renderActionLabel(button)}
                                </button>
                                )
                            })}
                        </div>
                    )}
                </div>
                <ConfirmDialog
                    embedded
                    isOpen={!!confirmButton?.confirm}
                    title={confirmButton?.confirm?.title}
                    message={confirmButton?.confirm?.message}
                    confirmLabel={confirmButton?.confirm?.confirmLabel ?? confirmButton?.name}
                    cancelLabel={confirmButton?.confirm?.cancelLabel}
                    onCancel={() => setConfirmButton(null)}
                    onConfirm={handleConfirm}
                />
            </div>
        </div>
    )
}

export default ImagePopup
