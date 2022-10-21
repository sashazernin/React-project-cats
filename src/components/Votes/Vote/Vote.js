import c from "./Vote.module.css";
import {deleteFromVote} from "../../../features/Votes/VotesSlice";
import {useDispatch} from "react-redux";

const Votes = (props) => {
    const dispatch = useDispatch()
    return (
        <tr className={c.item}>
            <td style={{width:'100px'}}>
                <img className={c.itemImage} src={props.imageUrl}/>
            </td>
            <td style={{textAlign: 'center'}} >
                {props.value === 1 ?
                    <span className={c.likeText} >Like</span>  :
                    <span className={c.dislikeText} >Dislike</span>
                }
            </td>
            <td style={{textAlign: 'center'}} >
                <span className={c.idText} >{props.id}</span>
            </td>
            <td style={{textAlign: 'end'}} >
                <button className={c.deleteButton} onClick={()=>{dispatch(deleteFromVote(props.id))}}>Delete</button>
            </td>
        </tr>
    )
}

export default Votes