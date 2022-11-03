import React, {useEffect, useRef, useState} from "react";
import c from './FindImage.module.css'
import {useDispatch, useSelector} from "react-redux";
import {getBreedsList, getImages, getCategoriesList, setImages, setRequestData} from "../../features/slices/findImageSlice";
import Preloader from "../common/Preloader/Preloader";
import {useInitialize} from "../../features/hooks/useInitialize";
import ImagePopup from "../common/ImagePopup/ImagePopup";
import {useSwitchFavorite} from "../../features/hooks/useSwitchFavorite";
import {useCheckFavorite} from "../../features/hooks/useCheckFavorite";
import {deleteFromFavorite} from "../../features/slices/FavoritesSlice";
import NullMessage from "../common/NullMessage/NullMessage";
import MessagePopup from "../common/ErrorMessage/messagePopup";

const FindImage = () => {
    const dispatch = useDispatch()
    const allImages = useSelector(state => state.findImage.allImages)
    const SubscriberName = useSelector(state => state.Subscriber.SubscriberName)
    const breedsList = useSelector(state => state.findImage.breedsList)
    const categoriesList = useSelector(state => state.findImage.categoriesList)
    const requestData = useSelector(state => state.findImage.requestData)
    const pageRef = useRef()
    const [errorMessage,setErrorMessage] = useState()
    useInitialize(!breedsList, true,getBreedsList,setErrorMessage)
    useInitialize(!categoriesList, true,getCategoriesList,setErrorMessage)
    useInitialize(!allImages, true,setRequestData, {'name':'userId','value':SubscriberName})
    const [popupOpened, setPopupOpened] = useState(false)
    const [popupData, setPopupData] = useState({
        'favoriteId': null,
        'imageId': null,
        'imageUrl': null,
        'isFavorite': false,
        'setFavoriteData': null
    })
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
        setPopupData({favoriteId, imageId, imageUrl, isFavorite, setFavoriteData})
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

        if (isFavorite !== popupData.isFavorite) {
            switchFavoriteFunction()
        }
    }

    useEffect(() => {
        if (!requestData.isLoading && !!requestData.userId && requestData.page !== requestData.lastPage) {
            dispatch(setRequestData({'name':'lastPage','value':requestData.page}))
            dispatch(getImages([requestData,setErrorMessage]))
        }
    }, [requestData.page, requestData.breed_id, requestData.category, requestData.type,requestData.userId])

    const switchImage = (e) => {
        dispatch(setImages(null))
        dispatch(setRequestData({'name': e.target.name, 'value': e.target.value}))
    }
    window.onscroll = function () {
        if (pageRef.current.getBoundingClientRect().bottom <= window.innerHeight + 500
            && !requestData.isLoading
            && !requestData.allPagesLoad
        ) {
            dispatch(setRequestData({'name': 'page', 'value': requestData.page + 1}))
        }
    }
    if (!breedsList || !categoriesList) {
        return (
            <Preloader/>
        )
    }
    return (
        <div ref={pageRef} className={c.body}>
            <MessagePopup type={'error'} message={errorMessage} clear={()=>{setErrorMessage(null)}} />
            <ImagePopup
                isFavorite={popupData.isFavorite}
                isOpened={popupOpened}
                close={closePopup}
                favoriteId={popupData.favoriteId}
                imageId={popupData.imageId}
                imageUrl={popupData.imageUrl}
            />
            <div className={c.selectorsContainer}>
                <div className={c.selectorBody}>
                    <span className={c.selectorText}>Breed</span>
                    <span className={c.label}></span>
                    <select className={c.selector} onChange={switchImage} name={'breed'} value={requestData.breed_id}>
                        <option value={''}>All</option>
                        {breedsList.map(breed =>
                            <option key={breed.id} value={breed.id}>{breed.name}</option>
                        )}
                    </select>
                </div>
                <div className={c.selectorBody}>
                    <span className={c.selectorText}>Category</span>
                    <span className={c.label}></span>
                    <select className={c.selector} onChange={switchImage} name={'category'} value={requestData.category}>
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
            {!!allImages && requestData.isLoading && !requestData.allPagesLoad && <Preloader/>}
        </div>
    )
}

const Image = (props) => {
    const [favoriteData,, setFavoriteData] = useCheckFavorite(props.imageId)
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

export default FindImage