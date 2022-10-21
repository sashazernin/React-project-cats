import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {favoriteApi} from "../../Api";


const initialState = {
    allFavorites: {}
}

export const getFavorites = createAsyncThunk('favorites/getFavorites',
    async (data, {dispatch}) => {
        try {
            const resp = await favoriteApi.getAllFavorites(data)
            dispatch(setFavorites(resp.data))
        } catch {
            alert('some error')
        }
    }
)

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        setFavorites: (state, action) => {
            state.allFavorites = action.payload
        },
        deleteFromFavorite: (state,action) => {
            state.allFavorites = state.allFavorites.filter(favorite => favorite.id !== action.payload)
        }
    }
})

export const {setFavorites,deleteFromFavorite} = favoritesSlice.actions
export default favoritesSlice.reducer