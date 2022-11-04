import React, {useRef, useState} from "react";
import c from './Upload.module.css'
import {useDispatch, useSelector} from "react-redux";
import Preloader from "../common/Preloader/Preloader";
import ImagePopup from "../common/ImagePopup/ImagePopup";
import {useSwitchFavorite} from "../../features/hooks/useSwitchFavorite";
import {useCheckFavorite} from "../../features/hooks/useCheckFavorite";
import {deleteFromFavorite} from "../../features/slices/FavoritesSlice";
import NullMessage from "../common/NullMessage/NullMessage";
import {useInitialize} from "../../features/hooks/useInitialize";
import {deleteUploadImage, getImages, setRequestInfo, uploadImage} from "../../features/slices/UploadSlice";
import {useEffect} from "react";
import MessagePopup from "../common/ErrorMessage/messagePopup";

const Upload = () => {
    const dispatch = useDispatch()
    const allUploadImages = useSelector(state => state.upload.allUploadImages)
    const SubscriberName = useSelector(state => state.Subscriber.SubscriberName)
    const pageRef = useRef()
    const [popupOpened, setPopupOpened] = useState(false)
    const requestInfo = useSelector(state => state.upload.requestInfo)
    const imageIsLoading = useSelector(state => state.upload.imageIsLoading)
    const [errorMessage, setErrorMessage] = useState()
    const [successMessage, setSuccessMessage] = useState()
    const [popupData, setPopupData] = useState({
        'favoriteId': null,
        'imageId': null,
        'imageUrl': null,
        'isFavorite': false,
        'setFavoriteData': null,
    })
    useInitialize(!allUploadImages, true, setRequestInfo, {'name': 'userId', 'value': SubscriberName})
    useEffect(() => {
        if (!requestInfo.isLoading && !!requestInfo.userId && requestInfo.page !== requestInfo.lastPage) {
            dispatch(setRequestInfo({'name': 'lastPage', 'value': requestInfo.page}))
            dispatch(getImages([requestInfo, setErrorMessage]))
        }
    }, [requestInfo.page, requestInfo.userId])
    const [switchFavorite] = useSwitchFavorite(
        popupData.imageId,
        popupData.favoriteId,
        popupData.isFavorite,
        setErrorMessage,
        (id) => {
            popupData.setFavoriteData({'isFavorite': !popupData.isFavorite, 'favoriteId': id})
        }
    )

    function openPopup(favoriteId, imageId, imageUrl, isFavorite, setFavoriteData) {
        setPopupData({...popupData, favoriteId, imageId, imageUrl, isFavorite, setFavoriteData})
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
            switchFavoriteFunction().then()
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
            if (e.target.files[0].size <= 262144) {
                await dispatch(uploadImage([{
                    'file': e.target.files[0],
                    'sub_id': SubscriberName
                }, setErrorMessage, setSuccessMessage]))
            } else {
                if (e.target.files[0].type !== 'image/jpeg') {
                    setErrorMessage('Your image is too big. Max size is 250kb. Try to convert your image to jpg')
                } else {
                    setErrorMessage('Your image is too big. Max size is 250kb')
                }

            }
        }
    }

    const deleteImage = (imageId) => {
        dispatch(deleteUploadImage([imageId, setErrorMessage]))
        setPopupOpened(false)
    }

    return (
        <div ref={pageRef} className={c.body}>
            <h1 className={c.title}>Upload</h1>
            <div className={c.container}>
                <MessagePopup type={'error'} message={errorMessage} clear={() => {
                    setErrorMessage(null)
                }}/>
                <MessagePopup type={'success'} message={successMessage} clear={() => {
                    setSuccessMessage(null)
                }}/>
                <ImagePopup
                    inProcess={popupData.inProcess}
                    isFavorite={popupData.isFavorite}
                    isOpened={popupOpened}
                    close={closePopup}
                    favoriteId={popupData.favoriteId}
                    imageId={popupData.imageId}
                    imageUrl={popupData.imageUrl}
                    buttons={[{
                        'name': 'delete Image',
                        'onClickFunction': deleteImage,
                        'functionData': popupData.imageId
                    }]}
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

                {Object.entries(allUploadImages).length === 0 ? <NullMessage message={'No uploaded images'}/> :
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