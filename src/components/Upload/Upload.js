import React, {useRef, useState} from "react";
import c from './Upload.module.css'
import {useDispatch, useSelector} from "react-redux";
import Preloader from "../common/Preloader/Preloader";
import ImagePopup from "../common/ImagePopup/ImagePopup";
import {useSwitchFavorite} from "../../hooks/useSwitchFavorite";
import {useCheckFavorite} from "../../hooks/useCheckFavorite";
import {deleteFromFavorite} from "../../slices/FavoritesSlice";
import NullMessage from "../common/NullMessage/NullMessage";
import {useInitialize} from "../../hooks/useInitialize";
import {getImages, setRequestInfo, uploadImage} from "../../slices/UploadSlice";
import {useEffect} from "react";
import {useToggling} from "../../hooks/useToggling";

const Upload = () => {
    const dispatch = useDispatch()
    const allUploadImages = useSelector(state => state.upload.allUploadImages)
    const userId = useSelector(state => state.user.id)
    const pageRef = useRef()
    const [popupOpened, setPopupOpened] = useState(false)
    const requestInfo = useSelector(state => state.upload.requestInfo)
    const imageIsLoading = useSelector(state => state.upload.imageIsLoading)
    const [popupData, setPopupData] = useState({
        'favoriteId': null,
        'imageId': null,
        'imageUrl': null,
        'isFavorite': false,
        'setFavoriteData': null,
    })
    useInitialize(!allUploadImages, setRequestInfo, {'name': 'userId', 'value': userId})
    useEffect(() => {
        if (!requestInfo.isLoading && !!requestInfo.userId && requestInfo.page !== requestInfo.lastPage) {

            dispatch(setRequestInfo({'name': 'lastPage', 'value': requestInfo.page}))
            dispatch(getImages(requestInfo))
        }
    }, [requestInfo.page, requestInfo.userId])
    const [switchFavorite] = useSwitchFavorite(
        popupData.imageId,
        popupData.favoriteId,
        popupData.isFavorite,
        (id) => {popupData.setFavoriteData({'isFavorite': !popupData.isFavorite, 'favoriteId': id})
        }
    )

    function openPopup(favoriteId, imageId, imageUrl, isFavorite, setFavoriteData) {
        setPopupData({...popupData,favoriteId, imageId, imageUrl, isFavorite, setFavoriteData})
        setPopupOpened(true)
    }

    function closePopup(isFavorite) {
        setPopupOpened(false)
        const switchFavoriteFunction = async () => {
            await switchFavorite()
            if (!isFavorite) {
                dispatch(deleteFromFavorite(popupData.favoriteId))
            }
        }

        if (isFavorite !== popupData.isFavorite && !popupData.inProcess) {
            switchFavoriteFunction()
        }
    }

    window.onscroll = function () {
        if (pageRef.current.getBoundingClientRect().bottom <= window.innerHeight + 500
            && !requestInfo.isLoading
            && !requestInfo.allPagesLoad
        ) {
            dispatch(setRequestInfo({'name': 'page', 'value': requestInfo.page + 1}))
        }
    }
    if (!allUploadImages) {
        return (
            <Preloader/>
        )
    }
    const onUploadImage = async (e) => {
        if (e.target.files.length) {
            await dispatch(uploadImage({'file': e.target.files[0], 'sub_id': userId}))
        }
    }

    return (
        <div ref={pageRef} className={c.body}>
            <ImagePopup
                inProcess = {popupData.inProcess}
                isFavorite={popupData.isFavorite}
                isOpened={popupOpened}
                close={closePopup}
                favoriteId={popupData.favoriteId}
                imageId={popupData.imageId}
                imageUrl={popupData.imageUrl}
            />
            <div className={c.fileUploadBody}>
                <label className={c.fileUploadContainer}>
                    <span className={c.fileUploadText}>Upload a cat</span>
                    <input type={"file"} onChange={onUploadImage} accept="image/*" className={c.fileUploadInput}/>
                    {imageIsLoading &&
                        <>
                            <div className={c.preloader}>
                                <Preloader/>
                            </div>
                        </>
                    }
                </label>
            </div>

            {Object.entries(allUploadImages).length === 0 ? <NullMessage message={'no Images'}/> :
                <div className={c.bodyItems}>
                    {allUploadImages.map(f =>
                        <Image key={f.id} openPopup={openPopup} condition={popupOpened} isFavorite={false}
                               favoriteId={null} imageId={f.id}
                               imageUrl={f.url}
                        />
                    )}
                    <div className={c.item}>
                    </div>
                    <div className={c.item}>
                    </div>
                    <div className={c.item}>
                    </div>
                    <div className={c.item}>
                    </div>
                </div>
            }
            {requestInfo.isLoading && <Preloader/>}
        </div>
    )
}

const Image = (props) => {
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

export default Upload