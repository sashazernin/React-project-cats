import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {imagesAPI} from "../Api";

const initialState = {
    allUploadImages: null,
    requestInfo: {
        'page': 0,
        'lastPage': null,
        'isLoading': false,
        'allPagesLoad': false,
        'userId': null
    },
    'imageIsLoading': false
}

export const getImages = createAsyncThunk('Upload/getImages',
    async ([data, setErrorMessage], {dispatch}) => {
        try {
            dispatch(setRequestInfo({'name': 'isLoading', 'value': true}))
            const resp = await imagesAPI.getUploadImages(data)
            if (resp.data.length === 0) {
                dispatch(setRequestInfo({'name': 'allPagesLoad', 'value': true}))
            }
            dispatch(setImages(resp.data))
        } catch (error) {
            alert(error)
            setErrorMessage(error)
        } finally {
            dispatch(setRequestInfo({'name': 'isLoading', 'value': false}))
        }
    }
)
export const uploadImage = createAsyncThunk('Upload/uploadImage',
    async ([data, setErrorMessage, setSuccessMessage], {dispatch}) => {
        dispatch(setImageIsLoading(true))
        try {
            const resp = await imagesAPI.uploadImage(data)
            setSuccessMessage('Success')
        } catch (error) {
            switch (error.response.data) {
                case "Invalid file data. Check you are sending the formdata.append('file', ...} format'":
                    setErrorMessage('You are trying to upload a file. Not an image!')
                    break
                case "Classifcation failed: correct animal not found.":
                    setErrorMessage("it's not a cat")
                    break
                default:
                    setErrorMessage(error.message)
            }
        } finally {
            dispatch(setImageIsLoading(false))
        }
    }
)

export const deleteUploadImage = createAsyncThunk('Upload/deleteUploadImage',
    async (data, {dispatch}) => {
        try {
            dispatch(deleteImage(data))
            const resp = await imagesAPI.deleteUploadImage(data)
        } catch (error) {
            alert(error)
        }
    })

const uploadSlice = createSlice({
    name: 'Upload',
    initialState,
    reducers: {
        setImages: (state, action) => {
            if (!state.allUploadImages || !action.payload) {
                state.allUploadImages = action.payload
            } else {
                action.payload.forEach(item => state.allUploadImages.push(item))
            }
        },
        setRequestInfo: (state, action) => {
            switch (action.payload.name) {
                case 'isLoading':
                    state.requestInfo.isLoading = action.payload.value
                    break
                case 'page':
                    state.requestInfo.page = action.payload.value
                    break
                case 'allPagesLoad':
                    state.requestInfo.allPagesLoad = true
                    break
                case 'userId':
                    state.requestInfo.userId = action.payload.value
                    break
                case 'lastPage':
                    state.requestInfo.lastPage = action.payload.value
                    break
                default:
                    console.error('Wrong name in UpdateSlice/setRequestData')
            }
        },
        setImageIsLoading: (state, action) => {
            state.imageIsLoading = action.payload
        },
        deleteImage: (state, action) => {
            state.allUploadImages = state.allUploadImages.filter(image => image.id !== action.payload)
        }
    }
})

export const {setImages, setRequestInfo, setImageIsLoading, deleteImage} = uploadSlice.actions
export default uploadSlice.reducer















