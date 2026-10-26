import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {favoriteApi} from "../Api";

export const FAVORITES_PAGE_SIZE = 20

const initialState = {
    allFavorites: null,
    favoritesPage: 0,
    favoritesHasMore: false,
    favoritesPageSize: FAVORITES_PAGE_SIZE,
}

export const getFavorites = createAsyncThunk('favorites/getFavorites',
    async ([subscriberName, page, setErrorMessage], {dispatch, getState}) => {
        try {
            const pageSize = getState().favorites.favoritesPageSize ?? FAVORITES_PAGE_SIZE
            const resp = await favoriteApi.getAllFavorites(subscriberName, page, pageSize)
            const favorites = Array.isArray(resp.data) ? resp.data : []
            dispatch(setFavorites({
                favorites,
                page,
                hasMore: favorites.length >= pageSize,
            }))
        } catch (error) {
            setErrorMessage(error.message)
        }
    }
)

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        setFavorites: (state, action) => {
            state.allFavorites = action.payload.favorites
            state.favoritesPage = action.payload.page
            state.favoritesHasMore = action.payload.hasMore
        },
        deleteFromFavorite: (state, action) => {
            state.allFavorites = state.allFavorites.filter(favorite => favorite.id !== action.payload)
        },
        addToFavorite: (state, action) => {
            state.allFavorites.push(action.payload)
        },
        setFavoritesPageSize: (state, action) => {
            state.favoritesPageSize = action.payload
        },
    }
})

export const {setFavorites, deleteFromFavorite, setFavoritesPageSize} = favoritesSlice.actions
export default favoritesSlice.reducer
