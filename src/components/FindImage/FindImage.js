import React, {useEffect, useRef, useState} from "react";
import c from './FindImage.module.css'
import {useDispatch, useSelector} from "react-redux";
import {getBreedsList, getImages, getCategoriesList, setImages, setRequestData} from "../../slices/findImageSlice";
import Preloader from "../common/Preloader/Preloader";
import {useInitialize} from "../../hooks/useInitialize";
import ImagePopup from "../common/ImagePopup/ImagePopup";
import {useSwitchFavorite} from "../../hooks/useSwitchFavorite";
import {useCheckFavorite} from "../../hooks/useCheckFavorite";
import {deleteFromFavorite} from "../../slices/FavoritesSlice";
import NullMessage from "../common/NullMessage/NullMessage";

const FindImage = () => {
    const dispatch = useDispatch()
    const allImages = useSelector(state => state.findImage.allImages)
    const userId = useSelector(state => state.user.id)
    const breedsList = useSelector(state => state.findImage.breedsList)
    const categoriesList = useSelector(state => state.findImage.categoriesList)
    const requestData = useSelector(state => state.findImage.requestData)
    const pageRef = useRef()
    useInitialize(!breedsList, getBreedsList)
    useInitialize(!categoriesList, getCategoriesList)
    useInitialize(!requestData, (data) => dispatch(setRequestData(data)), {
        'breed_id': '',
        'category': '',
        'type': '',
        'page': 0,
        'isLoading': false,
        userId
    })
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
        if (!requestData.isLoading) {
            dispatch(setRequestData({'name': 'isLoading', 'value': true}))
            dispatch(getImages(requestData))
        }
    }, [requestData.page, requestData.breed_id, requestData.category, requestData.type])

    const switchImage = (e) => {
        dispatch(setImages(null))
        dispatch(setRequestData({'name': e.target.name, 'value': e.target.value}))
    }
    window.onscroll = function () {
        if (pageRef.current.getBoundingClientRect().bottom <= window.innerHeight + 500 && !requestData.isLoading) {
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
                    <select className={c.selector} onChange={switchImage} name={'breed'} value={requestData.breed_id}>
                        <option value={''}>All</option>
                        {breedsList.map(breed =>
                            <option key={breed.id} value={breed.id}>{breed.name}</option>
                        )}
                    </select>
                </div>
                <div className={c.selectorBody}>
                    <span className={c.selectorText}>Category</span>
                    <select className={c.selector} onChange={switchImage} name={'category'} value={requestData.category}>
                        <option value={''}>All</option>
                        {categoriesList.map(category =>
                            <option key={category.id} value={category.id}>{category.name}</option>
                        )}
                    </select>
                </div>
                <div className={c.selectorBody}>
                    <spam className={c.selectorText}>Type</spam>
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