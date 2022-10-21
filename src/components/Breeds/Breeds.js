import React from "react";
import c from './Breeds.module.css'
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getBreedsList, getByBreeds} from "../../features/Breeds/BreedsSlice";
import Preloader from "../Preloader/Preloader";
import Breed from "./Breed/Breed";

const Breeds = () => {

    const dispatch = useDispatch()
    const breedsImages = useSelector(state => state.breeds.allBreedsImages)
    const userId = useSelector(state => state.user.id)
    const breedsList = useSelector(state => state.breeds.breedsList)

    useEffect(() => {

        async function startFetching() {
            await dispatch(getBreedsList())
            await dispatch(getByBreeds({breed_id: 'abys', userId}))
        }

        if (Object.entries(breedsList).length === 0) {
            startFetching();
        }

    }, [!breedsList]);

    if (Object.entries(breedsList).length === 0 || Object.entries(breedsImages).length === 0) {
        return (
            <Preloader/>
        )
    }

    const switchBreed = (e) => {
        dispatch(getByBreeds({breed_id: e.target.value, userId}))
    }

    return (
        <div className={c.body}>
                <select className={c.selector} onChange={switchBreed} name="pets" id="pet-select">
                    {breedsList.map(breed =>
                        <option value={breed.id}>{breed.name}</option>
                    )}
                </select>
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

        </div>
    )
}

export default Breeds