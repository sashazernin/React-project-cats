import {useDispatch, useSelector} from "react-redux";
import {deleteFromVote, getAllVotes} from "../../slices/VoteSlice";
import Preloader from "../common/Preloader/Preloader";
import c from "./VotesList.module.css";
import {useInitialize} from "../../hooks/useInitialize";
import React from "react";
import NullMessage from "../common/NullMessage/NullMessage";
import {useState} from "react";
import MessagePopup from "../common/ErrorMessage/messagePopup";

const VotesList = () => {
    const dispatch = useDispatch()
    const votes = useSelector(state => state.vote.allVotes)
    const userId = useSelector(state => state.user.id)
    const [errorMessage, setErrorMessage] = useState()
    useInitialize(!votes, getAllVotes, [userId, setErrorMessage])
    if (!votes) {
        return (
            <Preloader/>
        )
    }
    if (Object.entries(votes).length === 0) {
        return (
            <NullMessage message={'No Votes'}/>
        )
    }
    return (
        <>
            <MessagePopup type={'error'} message={errorMessage} clear={() => {
                setErrorMessage(null)
            }}/>
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
                    <tr key={f.id} className={c.item}>
                        <td style={{width: '100px'}}>
                            <img className={c.itemImage} src={f.image.url}/>
                        </td>
                        <td style={{textAlign: 'center'}}>
                            {f.value === 1 ?
                                <span className={c.likeText}>Like</span> :
                                <span className={c.dislikeText}>Dislike</span>
                            }
                        </td>
                        <td style={{textAlign: 'center'}}>
                            <span className={c.idText}>{f.id}</span>
                        </td>
                        <td style={{textAlign: 'end'}}>
                            <button className={c.deleteButton} onClick={() => {
                                dispatch(deleteFromVote([f.id, setErrorMessage]))
                            }}>Delete
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </>

    )
}

export default VotesList