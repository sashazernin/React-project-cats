import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import c from './Vote.module.css'
import fav from '../../styles/favoriteButton.module.css'
import {getRandomCat, createVote, setFavoriteId, getAllVotes} from "../../features/slices/VoteSlice";
import heart from "../../images/Heart.png"
import heartActive from "../../images/HeartActive.png";
import {useSwitchFavorite} from "../../features/hooks/useSwitchFavorite";
import {useInitialize} from "../../features/hooks/useInitialize";
import {useCheckFavorite} from "../../features/hooks/useCheckFavorite";
import {useEffect} from "react";
import Preloader from "../common/Preloader/Preloader";
import {setImage} from "../../features/slices/VoteSlice";
import MessagePopup from "../common/ErrorMessage/messagePopup";
import {ThumbDownIcon, ThumbUpIcon} from "./VoteIcons";
import layout from "../../styles/pageLayout.module.css";

const Vote = () => {
    const dispatch = useDispatch()
    const catImage = useSelector(state => state.vote.catUrl)
    const imageId = useSelector(state => state.vote.id)
    const SubscriberName = useSelector(state => state.Subscriber.SubscriberName)
    const [voteInProcess, setVoteInProcess] = useState(false)
    const [errorMessage, setErrorMessage] = useState()
    useInitialize(!catImage, true, getRandomCat, setErrorMessage)
    const [favoriteData, clear] = useCheckFavorite(imageId)
    useEffect(() => {
        dispatch(setFavoriteId(favoriteData.favoriteId))
    }, [favoriteData,dispatch])
    const vote = async (value) => {
        if (!voteInProcess) {
            dispatch(setImage({'url': null, 'id': null}))
            setVoteInProcess(true)
            await dispatch(createVote([{
                'image_id': imageId,
                'sub_id': SubscriberName,
                value
            }, setErrorMessage]))
            clear()
            setFavoriteId(null)
            dispatch(getAllVotes([SubscriberName, 0, setErrorMessage]))
            setVoteInProcess(false)
        }
    }
    const favoriteId = useSelector(state => state.vote.favoriteId)
    const [switchFavorite, favPop] = useSwitchFavorite(imageId, favoriteId, !!favoriteId, setErrorMessage, (id) => {
            dispatch(setFavoriteId(id))
    })
    return (
        <div className={`${layout.page} ${c.body}`}>
            <div className={layout.pageHead}>
                <h1 className={layout.pageTitle}>Vote</h1>
            </div>
            <div className={c.container}>
                <MessagePopup type={'error'} message={errorMessage} clear={() => {
                    setErrorMessage(null)
                }}/>
                <div className={c.imageField}>
                    {!catImage ? <Preloader/> :
                        <>
                            <img className={c.catImage} src={catImage} alt={'Cat'}/>
                            <button
                                type="button"
                                className={`${fav.favBtn} ${fav.favBtnOverlay} ${favoriteId ? fav.favBtnActive : ''} ${favPop ? fav.favBtnPop : ''}`}
                                onClick={() => {
                                switchFavorite()
                            }}
                                aria-label={favoriteId ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                <img className={fav.favIcon} src={!favoriteId ? heart : heartActive} alt={''}/>
                            </button>
                        </>
                    }
                </div>
                <div className={c.buttonRow}>
                    <button
                        type="button"
                        className={c.likeItButton}
                        disabled={voteInProcess}
                        aria-label="I like it"
                        onClick={() => {
                        vote(1).then()
                    }}
                    >
                        <ThumbUpIcon className={c.voteIcon} aria-hidden="true"/>
                    </button>
                    <button
                        type="button"
                        className={c.dontLikeItButton}
                        disabled={voteInProcess}
                        aria-label="I don't like it"
                        onClick={() => {
                        vote(0).then()
                    }}
                    >
                        <ThumbDownIcon className={c.voteIcon} aria-hidden="true"/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Vote