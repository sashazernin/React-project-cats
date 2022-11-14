import React, {useEffect, useState} from "react";
import c from './messagePopup.module.css'

const MessagePopup = (props) => {
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        if (!!props.message) {
            setVisible(true)
            setTimeout(() => {
                setTimeout(()=>{
                    props.clear()
                },300)
                setVisible(false)
            }, 4000)
        }
    }, [props.message])
    return (
        <div className={c.body} style={{opacity: visible ? 1 : 0,}}>
            <div className={c.container}
                 style={{background: props.type === 'error' ? 'red' : props.type === 'success' && '#17bb17'}} >
                <span className={c.message} >{props.message}</span>
            </div>
        </div>
    )
}

export default MessagePopup