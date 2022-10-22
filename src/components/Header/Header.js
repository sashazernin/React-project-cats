import c from './Header.module.css';
import React, {useEffect, useRef, useState} from 'react';
import {NavLink} from "react-router-dom";
import menuIcon from '../../images/menuIcon.png'
import {useOutsideClick} from "../../hooks/useOutsideClick";

const Link = (props) => {
    const isActive = ({isActive}) => (isActive ? c.activeLink : c.link)
    return (
        <NavLink className={isActive} to={props.path}>{props.name}</NavLink>
    )
}

const Header = () => {
    const [menuOpened, setMenuOpened] = useState(false)
    const switchMenuOpened = () => {
        setMenuOpened(!menuOpened)
    }
    const [menuRef] = useOutsideClick(menuOpened, switchMenuOpened)
    return (
        <header className={c.header}>
            <div className={c.headerBackground}></div>
            <NavLink to={'RandomCat'}>
                <img className={c.logo}
                     src='https://cdn131.picsart.com/276546134009211.png?to=crop&type=webp&r=1456x1456&q=85'/>
            </NavLink>
            <div ref={menuRef} className={c.menuIcon} onClick={switchMenuOpened}>
                <img src={menuIcon} className={c.menuIconImage}/>
            </div>
            <nav className={c.content}>
                <Link path={'RandomCat'} name={'Random Cat'}/>
                <Link path={'Vote'} name={'Vote'}/>
                <Link path={'Votes'} name={'Votes'}/>
                <Link path={'Favorites'} name={'Favorites'}/>
                <Link path={'Breeds'} name={'Breeds'}/>
                <Link path={'FindImage'} name={'Find image'}/>
                <Link path={'About'} name={'About'}/>
            </nav>
            <nav style={{visibility: menuOpened ? 'visible' : 'hidden'}} className={c.contentMini}>
                <Link path={'RandomCat'} name={'Random Cat'}/>
                <Link path={'Vote'} name={'Vote'}/>
                <Link path={'Votes'} name={'Votes'}/>
                <Link path={'Favorites'} name={'Favorites'}/>
                <Link path={'Breeds'} name={'Breeds'}/>
                <Link path={'FindImage'} name={'FindImage'}/>
                <Link path={'About'} name={'About'}/>
            </nav>
        </header>
    )
}
export default Header;