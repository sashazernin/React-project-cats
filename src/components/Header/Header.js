import c from './Header.module.css';
import React from 'react';
import {NavLink} from "react-router-dom";

const Header = (props) => {
    const isActive = ({isActive}) => (isActive ? c.active : c.Link)
    return (
        <header className={c.header}>
            <img
                src='https://e7.pngegg.com/pngimages/572/286/png-clipart-rip-n-dip-logo-middle-finger-cat-decal-sticker-cat-glass-white.png'></img>
            <div>
                <nav className={c.Content}>
                    <div className={c.item}>
                        <NavLink className={isActive} to="/RandomCat">Random Cat</NavLink>
                    </div>
                </nav>
            </div>
        </header>
    )
}
export default Header;