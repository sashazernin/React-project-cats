import React, {useState} from "react";
import c from './Breeds.module.css'
import {useDispatch, useSelector} from "react-redux";
import {getBreedsList, getByBreeds, setBreeds} from "../../slices/BreedsSlice";
import Preloader from "../common/Preloader/Preloader";
import {useInitializePage} from "../../hooks/useInitializePage";
import ImagePopup from "../common/ImagePopup/ImagePopup";
import {useSwitchFavorite} from "../../hooks/useSwitchFavorite";
import {useCheckFavorite} from "../../hooks/useCheckFavorite";
import {deleteFromFavorite, getFavorites} from "../../slices/FavoritesSlice";
import {useToggling} from "../../hooks/useToggling";
import {clear} from "@testing-library/user-event/dist/clear";

const Breeds = () => {

    const dispatch = useDispatch()
    const breedsImages = useSelector(state => state.breeds.allBreedsImages)
    const userId = useSelector(state => state.user.id)
    const breedsList = useSelector(state => state.breeds.breedsList)

    useInitializePage(!breedsList, getBreedsList)
    useInitializePage(!breedsList, getByBreeds, {breed_id: 'abys', userId})

    const [popupOpened, setPopupOpened] = useState(false)
    const [popupData, setPopupData] = useState({
        'favoriteId': null,
        'imageId': null,
        'imageUrl': null,
        'isFavorite': false,
        'update': null
    })
    const [switchFavorite] = useSwitchFavorite(
        popupData.imageId,
        popupData.favoriteId,
        popupData.isFavorite,
        (id) => {
            popupData.update({'isFavorite': !popupData.isFavorite, 'favoriteId': id})
        }
    )

    function openPopup(favoriteId, imageId, imageUrl, isFavorite, update) {
        setPopupData({favoriteId, imageId, imageUrl, isFavorite, update})
        setPopupOpened(true)
    }

    function closePopup(isFavorite) {
        setPopupOpened(false)
        const switchFavoriteFunction = async () => {
            await switchFavorite()
            if (!isFavorite) {
                dispatch(deleteFromFavorite(popupData.favoriteId))
            }
        }

        if (isFavorite !== popupData.isFavorite) {
            switchFavoriteFunction()
        }
    }

    if (!breedsList) {
        return (
            <Preloader/>
        )
    }

    const switchBreed = (e) => {
        dispatch(setBreeds(null))
        dispatch(getByBreeds({breed_id: e.target.value, userId}))
    }

    return (
        <div className={c.body}>
            <ImagePopup
                isFavorite={popupData.isFavorite}
                isOpened={popupOpened}
                close={closePopup}
                favoriteId={popupData.favoriteId}
                imageId={popupData.imageId}
                imageUrl={popupData.imageUrl}
            />
            <select className={c.selector} onChange={switchBreed} name="pets" id="pet-select">
                {breedsList.map(breed =>
                    <option key={breed.id} value={breed.id}>{breed.name}</option>
                )}
            </select>
            {!breedsImages ?
                <Preloader/> :
                <div className={c.bodyItems}>
                    {breedsImages.map(f =>
                        <Breed key={f.id} openPopup={openPopup} condition={popupOpened} isFavorite={false}
                               favoriteId={null} imageId={f.id}
                               imageUrl={f.url}/>
                    )}
                    <div className={c.item}>
                    </div>
                    <div className={c.item}>
                    </div>
                    <div className={c.item}>
                    </div>
                    <div className={c.item}>
                    </div>
                    <div className={c.item}>
                    </div>
                    <div className={c.item}>
                    </div>
                </div>
            }
        </div>
    )
}

const Breed = (props) => {
    const [condition, toggleCondition] = useToggling(false)
    const [favoriteData, clear, setFavoriteData] = useCheckFavorite(props.imageId)
    return (
        <div className={c.item}>
            <div className={c.favoriteButtonContainer}>
                <button className={c.favoriteButton}
                        onClick={() => {
                            props.openPopup(
                                !!favoriteData.favoriteId && favoriteData.favoriteId,
                                props.imageId,
                                props.imageUrl,
                                favoriteData.isFavorite,
                                setFavoriteData
                            )
                        }}
                >
                </button>
            </div>
            <img className={c.favoriteImage} src={props.imageUrl}/>
        </div>
    )
}

export default Breeds