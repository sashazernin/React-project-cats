import {useDispatch, useSelector} from "react-redux";
import {deleteFromVote, getAllVotes} from "../../features/slices/VoteSlice";
import Preloader from "../common/Preloader/Preloader";
import c from "./VotesList.module.css";
import {useInitialize} from "../../features/hooks/useInitialize";
import React from "react";
import NullMessage from "../common/NullMessage/NullMessage";
import {useState} from "react";
import MessagePopup from "../common/ErrorMessage/messagePopup";

const VotesList = () => {
    const dispatch = useDispatch()
    const votes = useSelector(state => state.vote.allVotes)
    const SubscriberName = useSelector(state => state.Subscriber.SubscriberName)
    const [errorMessage, setErrorMessage] = useState()
    useInitialize(!votes, true, getAllVotes, [SubscriberName, setErrorMessage])
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
        <div className={c.body}>
            <h1 className={c.title}>Votes</h1>
            <div className={c.container}>

                <MessagePopup type={'error'} message={errorMessage} clear={() => {
                    setErrorMessage(null)
                }}/>
                <table className={c.table}>
                    <colgroup>
                        <col className={c.itemImage}/>
                        <col/>
                        <col className={c.lineButton}/>
                    </colgroup>
                    <thead>
                    <tr>
                        <td className={c.headerText}>Photo</td>
                        <td className={c.headerText}>Choice</td>
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    {[...votes].reverse().map(f =>
                        <tr key={f.id} className={c.item}>
                            <td>
                                <img className={c.itemImage} src={f.image.url}/>
                            </td>
                            <td style={{textAlign: 'center', width: '500px'}}>
                                {f.value === 1 ?
                                    <span className={c.text} style={{color: 'greenyellow'}}>You are like it</span> :
                                    <span className={c.text} style={{color: 'red'}}>You are do not like it</span>
                                }
                            </td>
                            <td>
                                <button className={c.deleteButton} onClick={() => {
                                    dispatch(deleteFromVote([f.id, setErrorMessage]))
                                }}>Delete
                                </button>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default VotesList