import React from "react";
import c from './About.module.css'

const About = () => {
    return (
        <div className={c.body}>
            <div className={c.container}>
                <h1>About</h1>
                <span>This project created by Zernin Alexander. my email <a
                    href='https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=sashazernin1@gmail.com'>
                    sashazernin1@gmail.com
                    </a>
                </span>
                <h2>Sources</h2>
                <span>
                    I used a public application programming interface - <a href='https://thecatapi.com'>The Cat API </a>
                </span>
                <span>
                    Logo image by @timjohansson
                </span>
                <span>
                    Preloader modified by <a href='https://t.me/cat_with_a_knife'>Taru</a>.
                    <span> </span>
                    <a href='https://kwork.ru/editing-media/23339950/videomontazh'>his Kwork</a>
                </span>
            </div>
        </div>
    )
}

export default About