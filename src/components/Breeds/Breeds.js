import React from "react";
import c from './Breeds.module.css'
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getBreedsList, getByBreeds, setBreeds} from "../../features/Breeds/BreedsSlice";
import Preloader from "../common/Preloader/Preloader";
import Breed from "./Breed/Breed";
import {useInitializePage} from "../../hooks/useInitializePage";

const Breeds = () => {

    const dispatch = useDispatch()
    const breedsImages = useSelector(state => state.breeds.allBreedsImages)
    const userId = useSelector(state => state.user.id)
    const breedsList = useSelector(state => state.breeds.breedsList)

    useInitializePage(!breedsList,getBreedsList)
    useInitializePage(!breedsList,getByBreeds,{breed_id: 'abys', userId})

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
            <select className={c.selector} onChange={switchBreed} name="pets" id="pet-select">
                {breedsList.map(breed =>
                    <option key={breed.id} value={breed.id}>{breed.name}</option>
                )}
            </select>
            {!breedsImages ?
                <Preloader/> :
                <div className={c.bodyItems}>
                    {breedsImages.map(f =>
                        <Breed key={f.id} catId={f.image_id} imageUrl={f.url}/>
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

export default Breeds