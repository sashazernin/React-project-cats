import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {imagesAPI, listApi} from "../Api";

export const FIND_IMAGE_PAGE_SIZE = 20

const initialState = {
    allImages: null,
    breedsList: null,
    categoriesList: null,
    requestData: {
        breed_id: '',
        category: '',
        type: '',
        page: 0,
        pageSize: FIND_IMAGE_PAGE_SIZE,
        hasMore: false,
        isLoading: false,
        allPagesLoad: false,
        userId: null,
    },
}

export const getImages = createAsyncThunk('findImage/getImages',
    async ([page, setErrorMessage], {dispatch, getState}) => {
        try {
            const {requestData} = getState().findImage
            const pageSize = requestData.pageSize ?? FIND_IMAGE_PAGE_SIZE
            dispatch(setRequestData({name: 'isLoading', value: true}))
            const resp = await imagesAPI.getCatImages({...requestData, page, pageSize})
            const images = Array.isArray(resp.data) ? resp.data : []
            dispatch(setImagesPage({
                images,
                page,
                hasMore: images.length >= pageSize,
            }))
        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            dispatch(setRequestData({name: 'isLoading', value: false}))
        }
    }
)

export const getBreedsList = createAsyncThunk('findImage/getBreedsList',
    async (setErrorMessage, {dispatch}) => {
        try {
            const resp = await listApi.getBreedsList()
            dispatch(setBreedsList(resp.data))
        } catch (error) {
            setErrorMessage(error.message)
        }
    }
)

export const getCategoriesList = createAsyncThunk('findImage/getBreedsList',
    async (setErrorMessage, {dispatch}) => {
        try {
            const resp = await listApi.getCategoriesList()
            dispatch(setCategoriesList(resp.data))
        } catch (error) {
            setErrorMessage(error.message)
        }
    }
)

const findImageSlice = createSlice({
    name: 'findImage',
    initialState,
    reducers: {
        setImages: (state, action) => {
            state.allImages = action.payload
        },
        setImagesPage: (state, action) => {
            state.allImages = action.payload.images
            state.requestData.page = action.payload.page
            state.requestData.hasMore = action.payload.hasMore
            state.requestData.allPagesLoad = action.payload.images.length === 0
        },
        setBreedsList: (state, action) => {
            state.breedsList = action.payload.map(breedsInfo => ({'id': breedsInfo.id, 'name': breedsInfo.name}))
        },
        setCategoriesList: (state, action) => {
            state.categoriesList = action.payload.map(category => ({'id': category.id, 'name': category.name}))
        },
        setRequestData: (state, action) => {
            function resetFilters() {
                state.requestData.page = 0
                state.requestData.hasMore = false
                state.requestData.allPagesLoad = false
            }

            switch (action.payload.name) {
                case 'breed':
                    state.requestData.breed_id = action.payload.value
                    resetFilters()
                    break
                case 'category':
                    state.requestData.category = action.payload.value
                    resetFilters()
                    break
                case 'type':
                    state.requestData.type = action.payload.value
                    resetFilters()
                    break
                case 'pageSize':
                    state.requestData.pageSize = action.payload.value
                    resetFilters()
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
                default:
                    console.error('Wrong name in findImageSlice/setRequestData')
            }
        },
    }
})

export const {setImages, setImagesPage, setBreedsList, setCategoriesList, setRequestData} = findImageSlice.actions
export default findImageSlice.reducer