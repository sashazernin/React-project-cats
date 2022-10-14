import c from './Header.module.css';
import React from 'react';
import {NavLink} from "react-router-dom";

const Header = (props) => {
    const isActive = ({isActive}) => (isActive ? c.active : c.Link)
    return (
        <header className={c.header}>
            <NavLink to={'RandomCat'}>
                <img src='https://cdn131.picsart.com/276546134009211.png?to=crop&type=webp&r=1456x1456&q=85'></img>
            </NavLink>
                <nav className={c.Content}>
                    <div className={c.item}>
                        <NavLink className={isActive} to="/RandomCat">Random Cat</NavLink>
                    </div>
                    <div className={c.item}>
                        <NavLink className={isActive} to="/Vote">Vote</NavLink>
                    </div>
                </nav>
        </header>
    )
}
export default Header;