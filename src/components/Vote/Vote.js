import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import c from './Vote.module.css'
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
    }, [favoriteData])
    const vote = async (value) => {
        if (!voteInProcess) {
            dispatch(setImage({'url': null, 'id': null}))
            setVoteInProcess(true)
            await dispatch(createVote([{
                'image_id': imageId,
                'sub_id': SubscriberName,
                value
            }, setErrorMessage]))
            setVoteInProcess(false)
            clear()
            setFavoriteId(null)
            dispatch(getAllVotes([SubscriberName, setErrorMessage]))
        }
    }

    const favoriteId = useSelector(state => state.vote.favoriteId)
    const [switchFavorite] = useSwitchFavorite(imageId, favoriteId, !!favoriteId, setErrorMessage, (id) => {
            dispatch(setFavoriteId(id))
        }
    )
    return (
        <div className={c.body}>
            <h1 className={c.title}>Vote</h1>
            <div className={c.container}>
                <MessagePopup type={'error'} message={errorMessage} clear={() => {
                    setErrorMessage(null)
                }}/>
                <div className={c.imageField}>
                    {!catImage ? <Preloader/> :
                        <>
                            <img className={c.catImage} src={catImage}/>
                            <button className={c.favButton} onClick={() => {
                                switchFavorite()
                            }}>
                                <img className={c.favImage} src={!favoriteId ? heart : heartActive}/>
                            </button>
                        </>
                    }
                </div>
                <div>
                    <button className={c.likeItButton} onClick={() => {
                        vote(1).then()
                    }}>I like it
                    </button>
                    <button className={c.dontLikeItButton} onClick={() => {
                        vote(0).then()
                    }}>I don't like it
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Vote