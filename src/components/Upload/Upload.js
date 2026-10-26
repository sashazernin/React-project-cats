import React, {useState} from "react";
import c from './Upload.module.css'
import {useDispatch, useSelector} from "react-redux";
import Preloader from "../common/Preloader/Preloader";
import ImagePopup from "../common/ImagePopup/ImagePopup";
import catalog from "../../styles/catalogGrid.module.css";
import NullMessage from "../common/NullMessage/NullMessage";
import {useInitialize} from "../../features/hooks/useInitialize";
import {deleteUploadImage, getImages, setImages, setRequestInfo} from "../../features/slices/UploadSlice";
import MessagePopup from "../common/ErrorMessage/messagePopup";
import ImageWithCheckFavorite from "../common/ImageWithCheckFavorite/ImageWithCheckFavorite";
import {usePopupWithFavorite} from "../../features/hooks/usePopupWithFavorite";
import UploadCatButton from "../common/UploadCatButton/UploadCatButton";
import layout from "../../styles/pageLayout.module.css";
import PageSizeSelect from "../common/PageSizeSelect/PageSizeSelect";
import ConfirmDialog from "../common/ConfirmDialog/ConfirmDialog";

const Upload = () => {
    const dispatch = useDispatch()
    const allUploadImages = useSelector(state => state.upload.allUploadImages)
    const SubscriberName = useSelector(state => state.Subscriber.SubscriberName)
    const requestInfo = useSelector(state => state.upload.requestInfo)
    const [errorMessage, setErrorMessage] = useState()
    const [successMessage, setSuccessMessage] = useState()
    const [popupOpened, setPopupOpened] = useState()
    const [pageLoading, setPageLoading] = useState(false)
    const [deleteConfirmId, setDeleteConfirmId] = useState(null)

    useInitialize(!requestInfo.userId, true, setRequestInfo, {name: 'userId', value: SubscriberName})
    useInitialize(
        allUploadImages === null && !!requestInfo.userId,
        true,
        getImages,
        [0, setErrorMessage]
    )

    const [popupData, openPopup, closePopup] = usePopupWithFavorite(setPopupOpened, setErrorMessage)

    const fetchPage = (page) => {
        if (page < 0 || pageLoading || requestInfo.isLoading) {
            return
        }
        if (page > requestInfo.page && !requestInfo.hasMore) {
            return
        }
        setPageLoading(true)
        dispatch(getImages([page, setErrorMessage]))
            .finally(() => setPageLoading(false))
    }

    const changePageSize = (size) => {
        if (pageLoading || size === requestInfo.pageSize) {
            return
        }
        dispatch(setImages(null))
        dispatch(setRequestInfo({name: 'pageSize', value: size}))
        setPageLoading(true)
        dispatch(getImages([0, setErrorMessage]))
            .finally(() => setPageLoading(false))
    }

    const onUploadSuccess = (msg) => {
        setSuccessMessage(msg)
        setPageLoading(false)
    }

    if (!allUploadImages && !requestInfo.userId) {
        return (<Preloader/>)
    }

    const deleteImage = (imageId) => {
        dispatch(deleteUploadImage([imageId, setErrorMessage]))
        setPopupOpened(false)
    }

    const imageRows = Array.isArray(allUploadImages) ? allUploadImages : []
    const showEmpty = allUploadImages !== null && !pageLoading && !requestInfo.isLoading && imageRows.length === 0

    return (
        <div className={`${layout.page} ${layout.pageFill} ${c.body}`}>
            <div className={layout.pageHead}>
                <div className={layout.titleRow}>
                    <h1 className={layout.pageTitle}>Upload</h1>
                    <UploadCatButton
                        compact
                        className={c.titleUpload}
                        onError={setErrorMessage}
                        onSuccess={onUploadSuccess}
                    />
                </div>
            </div>
            <MessagePopup type={'error'} message={errorMessage} clear={() => {
                setErrorMessage(null)
            }}/>
            <MessagePopup type={'success'} message={successMessage} clear={() => {
                setSuccessMessage(null)
            }}/>
            <ImagePopup
                popupData={popupData}
                isOpened={popupOpened}
                close={closePopup}
            />
            <ConfirmDialog
                isOpen={deleteConfirmId != null}
                title="Delete this image?"
                message="It will be removed from your uploads."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onCancel={() => setDeleteConfirmId(null)}
                onConfirm={() => {
                    deleteImage(deleteConfirmId)
                    setDeleteConfirmId(null)
                }}
            />
            <div className={c.scrollArea}>
                {allUploadImages === null || pageLoading ? (
                    <div className={c.pageLoader}>
                        <Preloader/>
                    </div>
                ) : showEmpty ? (
                    <NullMessage message={'No uploaded images'}/>
                ) : (
                    <div className={`${catalog.grid} ${c.bodyItems}`}>
                        {imageRows.map(f =>
                            <ImageWithCheckFavorite
                                key={f.id}
                                openPopup={openPopup}
                                condition={popupOpened}
                                isFavorite={false}
                                favoriteId={null}
                                imageId={f.id}
                                imageUrl={f.url}
                                onRequestDelete={setDeleteConfirmId}
                            />
                        )}
                    </div>
                )}
            </div>
            {allUploadImages !== null && !showEmpty && (
                <nav className={c.pagination} aria-label="Upload pagination">
                    <div className={c.paginationSide} aria-hidden="true"/>
                    <div className={c.paginationNav}>
                        <button
                            type="button"
                            className={c.pageButton}
                            disabled={pageLoading || requestInfo.page <= 0}
                            onClick={() => fetchPage(requestInfo.page - 1)}
                        >
                            Previous
                        </button>
                        <span className={c.pageInfo}>Page {requestInfo.page + 1}</span>
                        <button
                            type="button"
                            className={c.pageButton}
                            disabled={pageLoading || !requestInfo.hasMore}
                            onClick={() => fetchPage(requestInfo.page + 1)}
                        >
                            Next
                        </button>
                    </div>
                    <div className={c.paginationSideEnd}>
                        <PageSizeSelect
                            value={requestInfo.pageSize}
                            disabled={pageLoading}
                            onChange={changePageSize}
                        />
                    </div>
                </nav>
            )}
        </div>
    )
}

export default Upload
