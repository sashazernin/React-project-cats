import {useSelector} from "react-redux";
import {getAllVotes} from "../../slices/VotesListSlice";
import Preloader from "../common/Preloader/Preloader";
import c from "./VotesList.module.css";
import {useInitializePage} from "../../hooks/useInitializePage";
import VoteListItem from "./VoteListItem/VoteListItem";

const VotesList = () => {
    const votes = useSelector(state => state.votes.allVotes)
    const userId = useSelector(state => state.user.id)

    useInitializePage(!votes,getAllVotes,userId)

    if (!votes) {
        return (
            <Preloader/>
        )
    }
    if(Object.entries(votes).length === 0){
        return(
            <div>
                no
            </div>
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
                    <VoteListItem key={f.id} value={f.value} imageUrl={f.image.url} id={f.id}/>
                )}
                </tbody>
            </table>
    )
}

export default VotesList