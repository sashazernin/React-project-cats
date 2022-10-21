import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAllVotes} from "../../features/Votes/VotesSlice";
import Preloader from "../Preloader/Preloader";
import c from "./Votes.module.css";
import Favorite from "../Favorites/Favorite/Favorite";
import Vote from "./Vote/Vote";

const Votes = () => {
    const votes = useSelector(state => state.votes.allVotes)
    const dispatch = useDispatch()
    const userId = useSelector(state => state.user.id)
    useEffect(() => {
        async function startFetching() {
            await dispatch(getAllVotes(userId))
        }

        if (Object.entries(votes).length === 0) {
            startFetching();
        }
    }, [!votes])
    if (Object.entries(votes).length === 0) {
        return (
            <Preloader/>
        )
    }
    return (
            <table className={c.table}>
                <thead>
                <tr>
                    <td className={c.headerText}>Photo</td>
                    <td className={c.headerText}>Choice</td>
                    <td className={c.headerText}>id</td>
                    <td></td>
                </tr>
                </thead>
                <tbody>
                {votes.map(f =>
                    <Vote key={f.id} value={f.value} imageUrl={f.image.url} id={f.id}/>
                )}
                </tbody>
            </table>
    )
}

export default Votes