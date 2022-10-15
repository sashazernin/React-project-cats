import * as axios from "axios";
import header from "./components/Header/Header";

const instance = axios.default.create({
    baseURL: 'https://api.thecatapi.com/v1/',
    headers: {
        'x-api-key': 'live_rCS7q2EGZYaPuzWLUaQsjDru9ODC4aeQO7M2SZodFwnCFyGJFzRs2RpVLUiREliS'
    }
})

export const voteApi = {
    createAVote(data){
        return instance.post('votes',data)
    }
}

export const getRandomCatImage = () => {
    return instance.get(`images/search`)
}

export const favoriteApi = {
    createAFavorite(data){
        return instance.post('favourites',data)
    },
    deleteFromFavorite(favoriteId){
        return instance.delete(`favourites/${favoriteId}`)
    },
    getAllFavorites(user){
        return instance.get(`favourites?sub_id=${user}`)
    }
}