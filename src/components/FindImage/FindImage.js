import React, {useState} from "react";
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
import catalog from "../../styles/catalogGrid.module.css";
import layout from "../../styles/pageLayout.module.css";
import PageSizeSelect from "../common/PageSizeSelect/PageSizeSelect";
import OutlinedSelect from "../common/OutlinedSelect/OutlinedSelect";

const FindImage = () => {
    const dispatch = useDispatch()
    const allImages = useSelector(state => state.findImage.allImages)
    const SubscriberName = useSelector(state => state.Subscriber.SubscriberName)
    const breedsList = useSelector(state => state.findImage.breedsList)
    const categoriesList = useSelector(state => state.findImage.categoriesList)
    const requestData = useSelector(state => state.findImage.requestData)
    const [errorMessage, setErrorMessage] = useState()
    const [popupOpened, setPopupOpened] = useState(false)
    const [pageLoading, setPageLoading] = useState(false)

    useInitialize(!breedsList, true, getBreedsList, setErrorMessage)
    useInitialize(!categoriesList, true, getCategoriesList, setErrorMessage)
    useInitialize(!requestData.userId, true, setRequestData, {name: 'userId', value: SubscriberName})
    useInitialize(
        allImages === null && !!requestData.userId && !!breedsList && !!categoriesList,
        true,
        getImages,
        [0, setErrorMessage]
    )

    const [popupData, openPopup, closePopup] = usePopupWithFavorite(setPopupOpened, setErrorMessage)

    const fetchPage = (page) => {
        if (page < 0 || pageLoading || requestData.isLoading) {
            return
        }
        if (page > requestData.page && !requestData.hasMore) {
            return
        }
        setPageLoading(true)
        dispatch(getImages([page, setErrorMessage]))
            .finally(() => setPageLoading(false))
    }

    const switchImage = (e) => {
        dispatch(setImages(null))
        dispatch(setRequestData({name: e.target.name, value: e.target.value}))
        setPageLoading(true)
        dispatch(getImages([0, setErrorMessage]))
            .finally(() => setPageLoading(false))
    }

    const changePageSize = (size) => {
        if (pageLoading || size === requestData.pageSize) {
            return
        }
        dispatch(setImages(null))
        dispatch(setRequestData({name: 'pageSize', value: size}))
        setPageLoading(true)
        dispatch(getImages([0, setErrorMessage]))
            .finally(() => setPageLoading(false))
    }

    if (!breedsList || !categoriesList) {
        return (<Preloader/>)
    }

    const imageRows = Array.isArray(allImages) ? allImages : []
    const showEmpty = allImages !== null && !pageLoading && !requestData.isLoading && imageRows.length === 0

    return (
        <div className={`${layout.page} ${layout.pageFill} ${c.body}`}>
            <div className={layout.pageHead}>
                <h1 className={layout.pageTitle}>Find image</h1>
            </div>
            <MessagePopup type={'error'} message={errorMessage} clear={() => {
                setErrorMessage(null)
            }}/>
            <ImagePopup
                popupData={popupData}
                isOpened={popupOpened}
                close={closePopup}
            />
            <div className={c.selectorsContainer}>
                <OutlinedSelect
                    className={c.selectorField}
                    label="Breed"
                    name="breed"
                    value={requestData.breed_id}
                    onChange={switchImage}
                >
                    <option value="">All</option>
                    {breedsList.map((breed) => (
                        <option key={breed.id} value={breed.id}>{breed.name}</option>
                    ))}
                </OutlinedSelect>
                <OutlinedSelect
                    className={c.selectorField}
                    label="Category"
                    name="category"
                    value={requestData.category}
                    onChange={switchImage}
                >
                    <option value="">All</option>
                    {categoriesList.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </OutlinedSelect>
                <OutlinedSelect
                    className={c.selectorField}
                    label="Type"
                    name="type"
                    value={requestData.type}
                    onChange={switchImage}
                >
                    <option value="">All</option>
                    <option value="png,jpg">Static</option>
                    <option value="gif">Animated</option>
                </OutlinedSelect>
            </div>

            <div className={c.scrollArea}>
                {allImages === null || pageLoading ? (
                    <div className={c.pageLoader}>
                        <Preloader/>
                    </div>
                ) : showEmpty ? (
                    <NullMessage message={'no Images'}/>
                ) : (
                    <div className={`${catalog.grid} ${c.bodyItems}`}>
                        {imageRows.map(f =>
                            <ImageWithCheckFavorite key={f.id} openPopup={openPopup} condition={popupOpened}
                                                    isFavorite={false}
                                                    favoriteId={null} imageId={f.id}
                                                    imageUrl={f.url}
                            />
                        )}
                    </div>
                )}
            </div>

            {allImages !== null && !showEmpty && (
                <nav className={c.pagination} aria-label="Find image pagination">
                    <div className={c.paginationSide} aria-hidden="true"/>
                    <div className={c.paginationNav}>
                        <button
                            type="button"
                            className={c.pageButton}
                            disabled={pageLoading || requestData.page <= 0}
                            onClick={() => fetchPage(requestData.page - 1)}
                        >
                            Previous
                        </button>
                        <span className={c.pageInfo}>Page {requestData.page + 1}</span>
                        <button
                            type="button"
                            className={c.pageButton}
                            disabled={pageLoading || !requestData.hasMore}
                            onClick={() => fetchPage(requestData.page + 1)}
                        >
                            Next
                        </button>
                    </div>
                    <div className={c.paginationSideEnd}>
                        <PageSizeSelect
                            value={requestData.pageSize}
                            disabled={pageLoading}
                            onChange={changePageSize}
                        />
                    </div>
                </nav>
            )}
        </div>
    )
}

export default FindImage
