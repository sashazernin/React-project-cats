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
    'imageIsLoading':false
}

export const getImages = createAsyncThunk('Upload/getImages',
    async (data, {dispatch}) => {
        try {
            dispatch(setRequestInfo({'name': 'isLoading', 'value': true}))
            const resp = await imagesAPI.getUploadImages(data)
            if (resp.data.length !== 0) {
                dispatch(setImages(resp.data))
            } else {
                dispatch(setRequestInfo({'name': 'allPagesLoad', 'value': true}))
            }
        } catch (error) {
            alert(error)
        } finally {
            dispatch(setRequestInfo({'name': 'isLoading', 'value': false}))
        }
    }
)
export const uploadImage = createAsyncThunk('Upload/uploadImage',
    async (data, {dispatch}) => {
    dispatch(setImageIsLoading(true))
        try {
            const resp = await imagesAPI.uploadImage(data)
        } catch (error) {
            if (error.response.data === "Invalid file data. Check you are sending the formdata.append('file', ...} format'") {
                alert('You are trying to upload a file. Not an image!')
            }
            if (error.response.data === "Classifcation failed: correct animal not found.") {
                alert("it's not a cat")
            }
        }
        finally {
            dispatch(setImageIsLoading(false))
        }
    }
)

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
        setImageIsLoading:(state,action) => {
            state.imageIsLoading = action.payload
        }
    }
})

export const {setImages, setRequestInfo,setImageIsLoading} = uploadSlice.actions
export default uploadSlice.reducer















