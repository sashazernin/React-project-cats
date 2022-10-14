import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import c from './Vote.module.css'
import {getRandomCat, createVote, setFavoriteId} from "../../features/Vote/VoteSlice";
import heart from "../../images/Heart.png"
import heartActive from "../../images/HeartActive.png";
import {useSwitchFavorite} from "../../hooks/useSwitchFavorite";

const Vote = () => {
    const dispatch = useDispatch()
    const catImage = useSelector(state => state.vote.catUrl)
    const catId = useSelector(state => state.vote.id)
    const userId = useSelector(state => state.user.id)

    useEffect(() => {
        async function startFetching() {
            await dispatch(getRandomCat())
        }

        if (!catImage) {
            startFetching();
        }
    }, [!catImage]);

    function vote(value) {
        dispatch(createVote({
            'image_id': catId,
            'sub_id': userId,
            value
        }))
    }
    const favoriteId = useSelector(state => state.vote.favoriteId)
    const [switchFavorite] = useSwitchFavorite(catId,favoriteId,setFavoriteId)

    return (
        <div className={c.body}>
            <div className={c.cat}>
                <img className={c.catImage} src={catImage}/>
                <button className={c.favButton}>
                    <img className={c.favImage} src={!favoriteId ? heart : heartActive} onClick={()=>{switchFavorite()}}/>
                </button>
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