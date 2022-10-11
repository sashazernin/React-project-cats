import * as axios from "axios";

const instance = axios.default.create({
    baseURL: 'https://api.thecatapi.com/v1/',
    headers: {
        'x-api-key': 'live_rCS7q2EGZYaPuzWLUaQsjDru9ODC4aeQO7M2SZodFwnCFyGJFzRs2RpVLUiREliS'
    }
})

export const getRandomCatImage = () => {
    return instance.get(`images/search`)
}