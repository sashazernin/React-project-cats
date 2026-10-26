import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {imagesAPI} from "../Api";

export const UPLOAD_PAGE_SIZE = 20

const initialState = {
    allUploadImages: null,
    requestInfo: {
        page: 0,
        pageSize: UPLOAD_PAGE_SIZE,
        hasMore: false,
        isLoading: false,
        allPagesLoad: false,
        userId: null,
    },
    imageIsLoading: false,
}

export const getImages = createAsyncThunk('Upload/getImages',
    async ([page, setErrorMessage], {dispatch, getState}) => {
        try {
            const {requestInfo} = getState().upload
            const pageSize = requestInfo.pageSize ?? UPLOAD_PAGE_SIZE
            dispatch(setRequestInfo({name: 'isLoading', value: true}))
            const resp = await imagesAPI.getUploadImages({
                page,
                userId: requestInfo.userId,
                pageSize,
            })
            const images = Array.isArray(resp.data) ? resp.data : []
            dispatch(setImagesPage({
                images,
                page,
                hasMore: images.length >= pageSize,
            }))
        } catch (error) {
            setErrorMessage(error)
        } finally {
            dispatch(setRequestInfo({name: 'isLoading', value: false}))
        }
    }
)

const buildUploadFormData = ({file, sub_id}) => {
    const formData = new FormData()
    formData.append('file', file)
    if (sub_id) {
        formData.append('sub_id', sub_id)
    }
    return formData
}

const uploadErrorMessage = (error) => {
    const data = error.response?.data
    const message = typeof data === 'string' ? data : data?.message
    switch (message) {
        case "Invalid file data. Check you are sending the formdata.append('file', ...} format'":
            return 'You are trying to upload a file. Not an image!'
        case "Classifcation failed: correct animal not found.":
            return "it's not a cat"
        default:
            return message || error.message || 'Upload failed'
    }
}

export const uploadImage = createAsyncThunk('Upload/uploadImage',
    async ([data, setErrorMessage, onSuccess], {dispatch, getState}) => {
        dispatch(setImageIsLoading(true))
        try {
            const resp = await imagesAPI.uploadImage(buildUploadFormData(data))
            if (resp.status < 200 || resp.status >= 300) {
                setErrorMessage('Upload failed')
                return
            }
            onSuccess?.('Success')
            const {requestInfo} = getState().upload
            if (requestInfo.userId) {
                await dispatch(getImages([0, setErrorMessage]))
            }
        } catch (error) {
            setErrorMessage(uploadErrorMessage(error))
        } finally {
            dispatch(setImageIsLoading(false))
        }
    }
)

export const deleteUploadImage = createAsyncThunk('Upload/deleteUploadImage',
    async ([data, setErrorMessage], {dispatch}) => {
        try {
            dispatch(deleteImage(data))
            await imagesAPI.deleteUploadImage(data)
        } catch (error) {
            setErrorMessage(error.message)
        }
    })

const uploadSlice = createSlice({
    name: 'Upload',
    initialState,
    reducers: {
        setImages: (state, action) => {
            state.allUploadImages = action.payload
        },
        setImagesPage: (state, action) => {
            state.allUploadImages = action.payload.images
            state.requestInfo.page = action.payload.page
            state.requestInfo.hasMore = action.payload.hasMore
            state.requestInfo.allPagesLoad = action.payload.images.length === 0 && action.payload.page === 0
        },
        setRequestInfo: (state, action) => {
            switch (action.payload.name) {
                case 'isLoading':
                    state.requestInfo.isLoading = action.payload.value
                    break
                case 'page':
                    state.requestInfo.page = action.payload.value
                    break
                case 'pageSize':
                    state.requestInfo.pageSize = action.payload.value
                    state.requestInfo.page = 0
                    state.requestInfo.hasMore = false
                    state.requestInfo.allPagesLoad = false
                    break
                case 'allPagesLoad':
                    state.requestInfo.allPagesLoad = action.payload.value
                    break
                case 'userId':
                    state.requestInfo.userId = action.payload.value
                    break
                default:
                    console.error('Wrong name in UploadSlice/setRequestInfo')
            }
        },
        setImageIsLoading: (state, action) => {
            state.imageIsLoading = action.payload
        },
        deleteImage: (state, action) => {
            state.allUploadImages = state.allUploadImages.filter(image => image.id !== action.payload)
        },
    },
})

export const {setImages, setImagesPage, setRequestInfo, setImageIsLoading, deleteImage} = uploadSlice.actions
export default uploadSlice.reducer
