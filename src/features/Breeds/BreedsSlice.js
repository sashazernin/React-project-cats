import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {breedsApi, imagesAPI} from "../../Api";


const initialState = {
    allBreedsImages: null,
    breedsList:null
}

export const getByBreeds = createAsyncThunk('breeds/getByBreeds',
    async (data, {dispatch}) => {
        try {
            const resp = await imagesAPI.getCatImageByBreed(data)
            dispatch(setBreeds(resp.data))
        } catch {
            alert('some error')
        }
    }
)

export const getBreedsList = createAsyncThunk('breeds/getBreedsList',
    async (data, {dispatch}) => {
        try {
            const resp = await breedsApi.getBreedsList()
            dispatch(setBreedsList(resp.data))
        } catch {
            alert('some error')
        }
    }
)

const breedsSlice = createSlice({
    name: 'breeds',
    initialState,
    reducers: {
        setBreeds: (state, action) => {
            state.allBreedsImages = action.payload
        },
        setBreedsList:(state, action) => {
            state.breedsList = action.payload.map(breedsInfo => ({'id':breedsInfo.id,'name':breedsInfo.name}))
        }
    }
})

export const {setBreeds,setBreedsList} = breedsSlice.actions
export default breedsSlice.reducer