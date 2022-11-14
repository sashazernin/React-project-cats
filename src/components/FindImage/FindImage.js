import React, {useEffect, useState} from "react";
import c from './FindImage.module.css'
import {useDispatch, useSelector} from "react-redux";
import {
    getBreedsList,
    getImages,
    getCategoriesList,
    setImages,
    setRequestData
} from "../../features/slices/findImageSlice";
import Preloader from "../common/Preloader/Preloader";
import {useInitialize} from "../../features/hooks/useInitialize";
import ImagePopup from "../common/ImagePopup/ImagePopup";
import NullMessage from "../common/NullMessage/NullMessage";
import MessagePopup from "../common/ErrorMessage/messagePopup";
import ImageWithCheckFavorite from "../common/ImageWithCheckFavorite/ImageWithCheckFavorite";
import {usePopupWithFavorite} from "../../features/hooks/usePopupWithFavorite";
import {useChangeLoadedPage} from "../../features/hooks/useChangeLoadedPage";

const FindImage = () => {
    const dispatch = useDispatch()
    const allImages = useSelector(state => state.findImage.allImages)
    const SubscriberName = useSelector(state => state.Subscriber.SubscriberName)
    const breedsList = useSelector(state => state.findImage.breedsList)
    const categoriesList = useSelector(state => state.findImage.categoriesList)
    const requestData = useSelector(state => state.findImage.requestData)
    const [errorMessage, setErrorMessage] = useState()
    const [popupOpened, setPopupOpened] = useState(false)
    useInitialize(!breedsList, true, getBreedsList, setErrorMessage)
    useInitialize(!categoriesList, true, getCategoriesList, setErrorMessage)
    useInitialize(!allImages, true, setRequestData, {'name': 'userId', 'value': SubscriberName})
    useEffect(() => {
        if (!requestData.isLoading && !!requestData.userId && requestData.page !== requestData.lastPage) {
            dispatch(setRequestData({'name': 'lastPage', 'value': requestData.page}))
            dispatch(getImages([requestData, setErrorMessage]))
        }
    }, [requestData,dispatch])
    const [popupData, openPopup, closePopup] = usePopupWithFavorite(setPopupOpened, setErrorMessage)
    const switchImage = (e) => {
        dispatch(setImages(null))
        dispatch(setRequestData({'name': e.target.name, 'value': e.target.value}))
    }
    const [pageRef] = useChangeLoadedPage(requestData, () => {
        dispatch(setRequestData({'name': 'page', 'value': requestData.page + 1}))
    })
    if (!breedsList || !categoriesList) {return (<Preloader/>)}
    return (
        <div className={c.body}>
            <h1 className={c.title}>Find image</h1>
            <div ref={pageRef} className={c.container}>
                <MessagePopup type={'error'} message={errorMessage} clear={() => {
                    setErrorMessage(null)
                }}/>
                <ImagePopup
                    popupData={popupData}
                    isOpened={popupOpened}
                    close={closePopup}
                />
                <div className={c.selectorsContainer}>
                    <div className={c.selectorBody}>
                        <span className={c.selectorText}>Breed</span>
                        <span className={c.label}></span>
                        <select className={c.selector} onChange={switchImage} name={'breed'}
                                value={requestData.breed_id}>
                            <option value={''}>All</option>
                            {breedsList.map(breed =>
                                <option key={breed.id} value={breed.id}>{breed.name}</option>
                            )}
                        </select>
                    </div>
                    <div className={c.selectorBody}>
                        <span className={c.selectorText}>Category</span>
                        <span className={c.label}></span>
                        <select className={c.selector} onChange={switchImage} name={'category'}
                                value={requestData.category}>
                            <option value={''}>All</option>
                            {categoriesList.map(category =>
                                <option key={category.id} value={category.id}>{category.name}</option>
                            )}
                        </select>
                    </div>
                    <div className={c.selectorBody}>
                        <span className={c.selectorText}>Type</span>
                        <span className={c.label}></span>
                        <select className={c.selector} onChange={switchImage} name={'type'}>
                            <option value={''}>All</option>
                            <option value={'png,jpg'}>Static</option>
                            <option value={'gif'}>Animated</option>
                        </select>

                    </div>

                </div>

                {!allImages ? (!requestData.allPagesLoad ? <Preloader/> : <NullMessage message={'no Images'}/>) :
                    <div className={c.bodyItems}>
                        {allImages.map(f =>
                            <ImageWithCheckFavorite key={f.id} openPopup={openPopup} condition={popupOpened}
                                                    isFavorite={false}
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
                {!!allImages && requestData.isLoading && !requestData.allPagesLoad && <Preloader/>}
            </div>
        </div>
    )
}

export default FindImage