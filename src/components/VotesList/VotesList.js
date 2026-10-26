import {useDispatch, useSelector} from "react-redux";
import {deleteFromVote, getAllVotes, setVotesPageSize} from "../../features/slices/VoteSlice";
import PageSizeSelect from "../common/PageSizeSelect/PageSizeSelect";
import Preloader from "../common/Preloader/Preloader";
import c from "./VotesList.module.css";
import {useInitialize} from "../../features/hooks/useInitialize";
import React, {useState} from "react";
import NullMessage from "../common/NullMessage/NullMessage";
import MessagePopup from "../common/ErrorMessage/messagePopup";
import VoteListItem from "./VoteListItem";
import layout from "../../styles/pageLayout.module.css";
import ImagePopup from "../common/ImagePopup/ImagePopup";
import {usePopupWithFavorite} from "../../features/hooks/usePopupWithFavorite";

const VotesList = () => {
    const dispatch = useDispatch()
    const votes = useSelector(state => state.vote.allVotes)
    const votesPage = useSelector(state => state.vote.votesPage)
    const votesHasMore = useSelector(state => state.vote.votesHasMore)
    const votesPageSize = useSelector(state => state.vote.votesPageSize)
    const SubscriberName = useSelector(state => state.Subscriber.SubscriberName)
    const [errorMessage, setErrorMessage] = useState()
    const [pageLoading, setPageLoading] = useState(false)
    const [popupOpened, setPopupOpened] = useState(false)
    const [popupData, openPopup, closePopup] = usePopupWithFavorite(setPopupOpened, setErrorMessage)

    useInitialize(
        !votes,
        true,
        getAllVotes,
        [SubscriberName, 0, setErrorMessage]
    )

    const loadPage = (page) => {
        if (page < 0 || pageLoading) {
            return
        }
        if (page > votesPage && !votesHasMore) {
            return
        }
        setPageLoading(true)
        dispatch(getAllVotes([SubscriberName, page, setErrorMessage]))
            .finally(() => setPageLoading(false))
    }

    const changePageSize = (size) => {
        if (pageLoading || size === votesPageSize) {
            return
        }
        dispatch(setVotesPageSize(size))
        setPageLoading(true)
        dispatch(getAllVotes([SubscriberName, 0, setErrorMessage]))
            .finally(() => setPageLoading(false))
    }

    if (!votes && !pageLoading) {
        return (<Preloader/>)
    }

    const voteRows = Array.isArray(votes) ? votes : []

    if (!pageLoading && voteRows.length === 0) {
        return (<NullMessage message={'No Votes'}/>)
    }

    const handleDelete = (voteId) => {
        dispatch(deleteFromVote([voteId, setErrorMessage]))
    }

    return (
        <div className={`${layout.page} ${layout.pageFill} ${c.body}`}>
            <div className={layout.pageHead}>
                <h1 className={layout.pageTitle}>Votes</h1>
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
                    <ul className={c.list}>
                        {voteRows.map((vote) => (
                            <VoteListItem key={vote.id} vote={vote} onDelete={handleDelete} openPopup={openPopup}/>
                        ))}
                    </ul>
                )}
            </div>
            <nav className={c.pagination} aria-label="Votes pagination">
                <div className={c.paginationSide} aria-hidden="true"/>
                <div className={c.paginationNav}>
                    <button
                        type="button"
                        className={c.pageButton}
                        disabled={pageLoading || votesPage <= 0}
                        onClick={() => loadPage(votesPage - 1)}
                    >
                        Previous
                    </button>
                    <span className={c.pageInfo}>Page {votesPage + 1}</span>
                    <button
                        type="button"
                        className={c.pageButton}
                        disabled={pageLoading || !votesHasMore}
                        onClick={() => loadPage(votesPage + 1)}
                    >
                        Next
                    </button>
                </div>
                <div className={c.paginationSideEnd}>
                    <PageSizeSelect
                        value={votesPageSize}
                        disabled={pageLoading}
                        onChange={changePageSize}
                    />
                </div>
            </nav>
        </div>
    )
}

export default VotesList
