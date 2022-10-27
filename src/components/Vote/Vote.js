import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import c from './Vote.module.css'
import {getRandomCat, createVote, setFavoriteId, getAllVotes} from "../../slices/VoteSlice";
import heart from "../../images/Heart.png"
import heartActive from "../../images/HeartActive.png";
import {useSwitchFavorite} from "../../hooks/useSwitchFavorite";
import {useInitialize} from "../../hooks/useInitialize";
import {useCheckFavorite} from "../../hooks/useCheckFavorite";
import {useEffect} from "react";
import Preloader from "../common/Preloader/Preloader";
import {setImage} from "../../slices/VoteSlice";

const Vote = () => {
    const dispatch = useDispatch()
    const catImage = useSelector(state => state.vote.catUrl)
    const imageId = useSelector(state => state.vote.id)
    const userId = useSelector(state => state.user.id)
    const [voteInProcess, setVoteInProcess] = useState(false)

    useInitialize(!catImage, getRandomCat)
    const [favoriteData, clear] = useCheckFavorite(imageId)
    useEffect(() => {
        dispatch(setFavoriteId(favoriteData.favoriteId))
    }, [favoriteData])
    const vote = async (value) => {
        if (!voteInProcess) {
            dispatch(setImage({'url': null, 'id': null}))
            setVoteInProcess(true)
            await dispatch(createVote({
                'image_id': imageId,
                'sub_id': userId,
                value
            }))
            setVoteInProcess(false)
            clear()
            setFavoriteId(null)

            dispatch(getAllVotes(userId))
        }
    }

    const favoriteId = useSelector(state => state.vote.favoriteId)
    const [switchFavorite] = useSwitchFavorite(imageId, favoriteId, !!favoriteId,(id)=>dispatch(setFavoriteId(id)))

    return (
        <div className={c.body}>
            <div className={c.cat}>
                {!catImage ? <Preloader/> :
                    <>
                        <img className={c.catImage} src={catImage}/>
                        <button className={c.favButton}>
                            <img className={c.favImage} src={!favoriteId ? heart : heartActive} onClick={() => {
                                switchFavorite()
                            }}/>
                        </button>
                    </>
                }
            </div>
            <div>
                <button className={c.likeItButton} onClick={() => {
                    vote(1)
                }}>I like it
                </button>
                <button className={c.dontLikeItButton} onClick={() => {
                    vote(0)
                }}>I don't like it
                </button>
            </div>
        </div>
    )
}

export default Vote