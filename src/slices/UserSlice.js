import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    id: 'Developer'
}

const userSlice = createSlice({
    name: "randomCat",
    initialState,
    reducers: {
        setUserId: (state,action) => {
            state.id = action.payload
        }
    },
})

export const {setUserId} = userSlice.actions
export default userSlice.reducer