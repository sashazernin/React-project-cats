import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    SubscriberName: null
}

const subscriberSlice = createSlice({
    name: "Subscriber",
    initialState,
    reducers: {
        setSubscriberName: (state,action) => {
            state.SubscriberName = action.payload
        }
    },
})

export const {setSubscriberName} = subscriberSlice.actions
export default subscriberSlice.reducer