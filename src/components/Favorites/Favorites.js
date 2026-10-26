import React, {useEffect, useState} from "react";
import c from './Favorites.module.css'
import {useDispatch, useSelector} from "react-redux";
import {getFavorites, setFavoritesPageSize} from "../../features/slices/FavoritesSlice";
import PageSizeSelect from "../common/PageSizeSelect/PageSizeSelect";
import Preloader from "../common/Preloader/Preloader";
import {useInitialize} from "../../features/hooks/useInitialize";
import ImagePopup from "../common/ImagePopup/ImagePopup";
import NullMessage from "../common/NullMessage/NullMessage";
import MessagePopup from "../common/ErrorMessage/messagePopup";
import {usePopupWithFavorite} from "../../features/hooks/usePopupWithFavorite";
import {imagesAPI} from "../../features/Api";
import layout from "../../styles/pageLayout.module.css";
import catalog from "../../styles/catalogGrid.module.css";

const Favorite = ({openPopup, favoriteId, imageId, imageUrl: initialUrl}) => {
    const [imageUrl, setImageUrl] = useState(initialUrl ?? null)
    const [imageFailed, setImageFailed] = useState(false)

    useEffect(() => {
        if (initialUrl) {
            setImageUrl(initialUrl)
            setImageFailed(false)
            return
        }
        if (!imageId) {
            setImageUrl(null)
            return
        }
        let cancelled = false
        imagesAPI.getImageById(imageId)
            .then((resp) => {
                if (!cancelled && resp.data?.url) {
                    setImageUrl(resp.data.url)
                    setImageFailed(false)
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setImageFailed(true)
                }
            })
        return () => {
            cancelled = true
        }
    }, [initialUrl, imageId])

    const displayUrl = imageUrl && !imageFailed ? imageUrl : null

    return (
        <div className={`${catalog.tile} ${c.item}`}>
            <div className={c.favoriteButtonContainer}>
                <button
                    type="button"
                    className={c.favoriteButton}
                    aria-label="Open favorite"
                    onClick={() => {
                        openPopup(favoriteId, imageId, displayUrl, true, () => {})
                    }}
                />
            </div>
            {displayUrl ? (
                <img className={c.favoriteImage} src={displayUrl} alt={'Cat'} onError={() => setImageFailed(true)}/>
            ) : (
                <span className={c.deleteImage}>This image has been deleted</span>
            )}
        </div>
    )
}

const Favorites = () => {
    const dispatch = useDispatch()
    const favorites = useSelector(state => state.favorites.allFavorites)
    const favoritesPage = useSelector(state => state.favorites.favoritesPage)
    const favoritesHasMore = useSelector(state => state.favorites.favoritesHasMore)
    const favoritesPageSize = useSelector(state => state.favorites.favoritesPageSize)
    const SubscriberName = useSelector(state => state.Subscriber.SubscriberName)
    const [errorMessage, setErrorMessage] = useState()
    const [pageLoading, setPageLoading] = useState(false)
    const [popupOpened, setPopupOpened] = useState(false)
    const [popupData, openPopup, closePopup] = usePopupWithFavorite(setPopupOpened, setErrorMessage)

    useInitialize(
        !favorites,
        true,
        getFavorites,
        [SubscriberName, 0, setErrorMessage]
    )

    const loadPage = (page) => {
        if (page < 0 || pageLoading) {
            return
        }
        if (page > favoritesPage && !favoritesHasMore) {
            return
        }
        setPageLoading(true)
        dispatch(getFavorites([SubscriberName, page, setErrorMessage]))
            .finally(() => setPageLoading(false))
    }

    const changePageSize = (size) => {
        if (pageLoading || size === favoritesPageSize) {
            return
        }
        dispatch(setFavoritesPageSize(size))
        setPageLoading(true)
        dispatch(getFavorites([SubscriberName, 0, setErrorMessage]))
            .finally(() => setPageLoading(false))
    }

    if (!favorites && !pageLoading) {
        return (<Preloader/>)
    }

    const favoriteRows = Array.isArray(favorites) ? favorites : []

    if (!pageLoading && favoriteRows.length === 0) {
        return (<NullMessage message={'No Favorites'}/>)
    }

    return (
        <div className={`${layout.page} ${layout.pageFill} ${c.body}`}>
            <div className={layout.pageHead}>
                <h1 className={layout.pageTitle}>Favorites</h1>
            </div>
            <MessagePopup type={'error'} message={errorMessage} clear={() => {
                setErrorMessage(null)
            }}/>
            <ImagePopup
                popupData={popupData}
                isOpened={popupOpened}
                close={closePopup}
            />
            <div className={c.scrollArea}>
                {pageLoading ? (
                    <div className={c.pageLoader}>
                        <Preloader/>
                    </div>
                ) : (
                    <div className={`${catalog.grid} ${c.container}`}>
                        {favoriteRows.map((f) => (
                            <Favorite
                                openPopup={openPopup}
                                key={f.id}
                                favoriteId={f.id}
                                imageId={f.image_id}
                                imageUrl={f.image?.url}
                            />
                        ))}
                    </div>
                )}
            </div>
            <nav className={c.pagination} aria-label="Favorites pagination">
                <div className={c.paginationSide} aria-hidden="true"/>
                <div className={c.paginationNav}>
                    <button
                        type="button"
                        className={c.pageButton}
                        disabled={pageLoading || favoritesPage <= 0}
                        onClick={() => loadPage(favoritesPage - 1)}
                    >
                        Previous
                    </button>
                    <span className={c.pageInfo}>Page {favoritesPage + 1}</span>
                    <button
                        type="button"
                        className={c.pageButton}
                        disabled={pageLoading || !favoritesHasMore}
                        onClick={() => loadPage(favoritesPage + 1)}
                    >
                        Next
                    </button>
                </div>
                <div className={c.paginationSideEnd}>
                    <PageSizeSelect
                        value={favoritesPageSize}
                        disabled={pageLoading}
                        onChange={changePageSize}
                    />
                </div>
            </nav>
        </div>
    )
}

export default Favorites
