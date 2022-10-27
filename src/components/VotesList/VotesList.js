import {useSelector} from "react-redux";
import {getAllVotes} from "../../slices/VoteSlice";
import Preloader from "../common/Preloader/Preloader";
import c from "./VotesList.module.css";
import {useInitialize} from "../../hooks/useInitialize";
import VoteListItem from "./VoteListItem/VoteListItem";
import React from "react";
import NullMessage from "../common/NullMessage/NullMessage";

const VotesList = () => {
    const votes = useSelector(state => state.vote.allVotes)
    const userId = useSelector(state => state.user.id)

    useInitialize(!votes,getAllVotes,userId)

    if (!votes) {
        return (
            <Preloader/>
        )
    }
    if(Object.entries(votes).length === 0){
        return(
            <NullMessage message={'No Votes'}/>
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
                {[...votes].reverse().map(f =>
                    <VoteListItem key={f.id} value={f.value} imageUrl={f.image.url} id={f.id}/>
                )}
                </tbody>
            </table>
    )
}

export default VotesList