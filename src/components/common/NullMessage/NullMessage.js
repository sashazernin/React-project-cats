import React from "react";
import c from "./NullMessage.module.css"

function NullMessage(props){
    return(
        <div className={c.bodyNullMessage}>
                <span className={c.nullMessage}>
                    {props.message}
                </span>
        </div>
    )
}

export default NullMessage