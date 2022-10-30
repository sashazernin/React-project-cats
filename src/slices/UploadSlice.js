import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {imagesAPI} from "../Api";

const initialState = {
    allUploadImages: null,
    requestInfo: {
        'page': 0,
        'isLoading': false,
        'allPagesLoad': false,
        'userId': null
    }
}

export const getImages = createAsyncThunk('Upload/getImages',
    async (data, {dispatch}) => {
        try {
            dispatch(setRequestInfo({'name':'isLoading','value':true}))
            const resp = await imagesAPI.getUploadImages(data)
            if(resp.data.length !== 0){
                dispatch(setImages(resp.data))
            }else{
                dispatch(setRequestInfo({'name':'allPagesLoad','value':true}))
            }
        } catch (error) {
            alert(error)
        }
        finally {
            dispatch(setRequestInfo({'name':'isLoading','value':false}))
        }
    }
)
export const uploadImage = createAsyncThunk('Upload/uploadImage',
    async (data, {dispatch}) => {
        try {
            const resp = await imagesAPI.uploadImage(data)
            dispatch(getImages())
        } catch (error) {
            if(error.response.data === "Invalid file data. Check you are sending the formdata.append('file', ...} format'"){
                alert('You are trying to upload a file. Not an image!')
            }
            if(error.response.data === "Classifcation failed: correct animal not found."){
                alert("it's not a cat")
            }
        }
    }
)

const uploadSlice = createSlice({
    name: 'Upload',
    initialState,
    reducers: {
        setImages: (state, action) => {
            state.allUploadImages = action.payload
        },
        setRequestInfo: (state,action) => {
            switch (action.payload.name){
                case 'isLoading': state.requestInfo.isLoading = action.payload.value
                    break
                case 'page': state.requestInfo.page = action.payload.value
                    break
                case 'allPagesLoad':  state.requestInfo.allPagesLoad = true
                    break
                case 'userId': state.requestInfo.userId = action.payload.value
                    break
                default:
            }
        }
    }
})

export const {setImages,setRequestInfo} = uploadSlice.actions
export default uploadSlice.reducer