import React, {useState,useEffect} from "react";
import c from './Upload.module.css'
import {useDispatch, useSelector} from "react-redux";
import Preloader from "../common/Preloader/Preloader";
import ImagePopup from "../common/ImagePopup/ImagePopup";
import NullMessage from "../common/NullMessage/NullMessage";
import {useInitialize} from "../../features/hooks/useInitialize";
import {deleteUploadImage, getImages, setRequestInfo, uploadImage} from "../../features/slices/UploadSlice";
import MessagePopup from "../common/ErrorMessage/messagePopup";
import ImageWithCheckFavorite from "../common/ImageWithCheckFavorite/ImageWithCheckFavorite";
import {usePopupWithFavorite} from "../../features/hooks/usePopupWithFavorite";
import {useChangeLoadedPage} from "../../features/hooks/useChangeLoadedPage";

const Upload = () => {
    const dispatch = useDispatch()
    const allUploadImages = useSelector(state => state.upload.allUploadImages)
    const SubscriberName = useSelector(state => state.Subscriber.SubscriberName)
    const requestInfo = useSelector(state => state.upload.requestInfo)
    const imageIsLoading = useSelector(state => state.upload.imageIsLoading)
    const [errorMessage, setErrorMessage] = useState()
    const [successMessage, setSuccessMessage] = useState()
    const [popupOpened, setPopupOpened] = useState()
    useInitialize(!allUploadImages, true, setRequestInfo, {'name': 'userId', 'value': SubscriberName})
    useEffect(() => {
        if (!requestInfo.isLoading && !!requestInfo.userId && requestInfo.page !== requestInfo.lastPage) {
            dispatch(setRequestInfo({'name': 'lastPage', 'value': requestInfo.page}))
            dispatch(getImages([requestInfo, setErrorMessage]))
        }
    }, [requestInfo,dispatch])
    const [pageRef] = useChangeLoadedPage(requestInfo,()=>{
        dispatch(setRequestInfo({'name': 'page', 'value': requestInfo.page + 1}))
    })
    const [popupData,openPopup,closePopup] = usePopupWithFavorite(setPopupOpened,setErrorMessage)
    if (!allUploadImages) {return (<Preloader/>)}
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
                    popupData = {popupData}
                    isOpened={popupOpened}
                    close={closePopup}
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
                            <ImageWithCheckFavorite key={f.id} openPopup={openPopup} condition={popupOpened} isFavorite={false}
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


export default Upload