import c from './Header.module.css';
import React, {useState} from 'react';
import {NavLink} from "react-router-dom";
import {useOutsideClick} from "../../features/hooks/useOutsideClick";
import {useSelector} from "react-redux";

const Link = (props) => {
    const isActive = ({isActive}) => (isActive ? c.activeLink : c.link)
    return (
        <NavLink className={isActive} to={props.path}>{props.name}</NavLink>
    )
}

const LicksCount = () => {
    return (
        <>
            <Link path={'RandomCat'} name={'Random Cat'}/>
            <Link path={'Vote'} name={'Vote'}/>
            <Link path={'Votes'} name={'Votes'}/>
            <Link path={'Favorites'} name={'Favorites'}/>
            <Link path={'FindImage'} name={'Find image'}/>
            <Link path={'Upload'} name={'Upload'}/>
            <Link path={'About'} name={'About'}/>
        </>
    )
}

const Header = () => {
    const subscriberName = useSelector(state => state.Subscriber.SubscriberName)
    const [menuOpened, setMenuOpened] = useState(false)
    const [inputError, setInputError] = useState('')
    const switchMenuOpened = () => {setMenuOpened(!menuOpened)}
    const [menuRef] = useOutsideClick(menuOpened, switchMenuOpened)
    const setNewSubscriberName = (e) => {
        if (e.target.value.length <= 20 && e.target.value !== subscriberName
            && !(e.target.value.length === 0 && subscriberName === 'publicSubscriber')) {

            if (e.target.value.length === 0) {
                localStorage.removeItem('subscriberName')
            } else {
                localStorage.setItem('subscriberName', e.target.value)
            }
            console.log('qwe')
            window.location.reload()
        } else {
            e.target.value = e.target.defaultValue
            setInputError('')
        }
    }
    const onInputChange = (e) => {
        if (e.target.value.length > 20) {
            setInputError('is too long')
        } else {
            if (inputError !== '') {
                setInputError('')
            }
        }
    }
    const unFocusInput = (e) => {
        if (e.keyCode === 13) {
            e.target.blur()
        }
        if (e.keyCode === 27) {
            e.target.value = e.target.defaultValue
            setInputError('')
            e.target.blur()
        }
    }
    return (
        <header className={c.header}>
            <div className={c.headerBackground}></div>
            <div className={c.fixedContent}>
                <NavLink to={'About'}>
                    <img className={c.logo}
                         src='https://cdn131.picsart.com/276546134009211.png?to=crop&type=webp&r=1456x1456&q=85'
                         alt={''}
                    />
                </NavLink>
                <div className={c.containerHeaderInput}>
                    <div>
                        <input className={c.headerInput} placeholder={'Subscriber name'}
                               defaultValue={subscriberName !== 'publicSubscriber' ? subscriberName : null}
                               onChange={onInputChange}
                               onBlur={setNewSubscriberName}
                               onKeyDown={unFocusInput}
                        />
                    </div>
                    <div className={c.errorMessageContainer}>
                        <span
                            className={c.errorMessage}>{(!inputError && subscriberName === 'publicSubscriber') ? 'U\'re using a public name' : inputError}</span>
                    </div>
                </div>

            </div>

            <div ref={menuRef} className={c.menuIcon} onClick={switchMenuOpened}>
                <div className={c.menuIconBurger}>
                    <span></span>
                </div>

            </div>
            <nav className={c.content}>
                <LicksCount/>
            </nav>
            <nav style={{visibility: menuOpened ? 'visible' : 'hidden'}} className={c.contentMini}>
                <LicksCount/>
            </nav>
        </header>
    )
}
export default Header;