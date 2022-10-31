import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {breedsApi, imagesAPI, listApi} from "../Api";

const initialState = {
    allImages: null,
    breedsList: null,
    categoriesList: null,
    requestData: {
        'breed_id': '',
        'category': '',
        'type': '',
        'page': 0,
        'lastPage': null,
        'isLoading': false,
        'allPagesLoad': false,
        'userId': null
    }
}

export const getImages = createAsyncThunk('findImage/getImages',
    async (data, {dispatch}) => {
        try {
            dispatch(setRequestData({'name': 'isLoading', 'value': true}))
            const resp = await imagesAPI.getCatImages(data)
            if (resp.data.length !== 0) {
                dispatch(setImages(resp.data))
            } else {
                dispatch(setRequestData({'name': 'allPagesLoad', 'value': true}))
            }
        } catch (error) {
            alert(error)
        } finally {
            dispatch(setRequestData({'name': 'isLoading', 'value': false}))
        }
    }
)

export const getBreedsList = createAsyncThunk('findImage/getBreedsList',
    async (data, {dispatch}) => {
        try {
            const resp = await breedsApi.getBreedsList()
            dispatch(setBreedsList(resp.data))
        } catch (error) {
            alert(error)
        }
    }
)

export const getCategoriesList = createAsyncThunk('findImage/getBreedsList',
    async (data, {dispatch}) => {
        try {
            const resp = await listApi.getCategoriesList()
            dispatch(setCategoriesList(resp.data))
        } catch (error) {
            alert(error)
        }
    }
)

const findImageSlice = createSlice({
    name: 'findImage',
    initialState,
    reducers: {
        setImages: (state, action) => {
            if (!state.allImages || !action.payload) {
                state.allImages = action.payload
            } else {
                action.payload.forEach(item => state.allImages.push(item))
            }
        },
        setBreedsList: (state, action) => {
            state.breedsList = action.payload.map(breedsInfo => ({'id': breedsInfo.id, 'name': breedsInfo.name}))
        },
        setCategoriesList: (state, action) => {
            state.categoriesList = action.payload.map(category => ({'id': category.id, 'name': category.name}))
        },
        setRequestData: (state, action) => {
            function reset() {
                state.requestData.page = 0
                state.requestData.allPagesLoad = false
                state.requestData.lastPage = null
            }

            switch (action.payload.name) {
                case 'breed':
                    state.requestData.breed_id = action.payload.value
                    reset()
                    break
                case 'category':
                    state.requestData.category = action.payload.value
                    reset()
                    break
                case 'type':
                    state.requestData.type = action.payload.value
                    reset()
                    break
                case 'page':
                    state.requestData.page = action.payload.value
                    break
                case 'isLoading':
                    state.requestData.isLoading = action.payload.value
                    break
                case 'allPagesLoad':
                    state.requestData.allPagesLoad = action.payload.value
                    break
                case 'userId':
                    state.requestData.userId = action.payload.value
                    break
                case 'lastPage':
                    state.requestData.lastPage = action.payload.value
                    break
                default:
                    console.error('Wrong name in findImageSlice/setRequestData')
            }
        },
    }
})

export const {setImages, setBreedsList, setCategoriesList, setRequestData} = findImageSlice.actions
export default findImageSlice.reducer