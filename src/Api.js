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
    },
    getAllVotes(user){
        return instance.get(`votes?sub_id=${user}`)
    },
    DeleteFromVote(voteId){
        return instance.delete(`votes/${voteId}`)
    }
}

export const getRandomCatImage = () => {
    console.warn('use the imagesAPI.getRandomCatImage()')
    return imagesAPI.getRandomCatImage()
}

export const favoriteApi = {
    createAFavorite(data){
        return instance.post('favourites',data)
    },
    deleteFromFavorite(favoriteId){
        return instance.delete(`favourites/${favoriteId}`)
    },
    getAllFavorites(userId){
        return instance.get(`favourites?sub_id=${userId}`)
    }
}

export const breedsApi = {
    getBreedsList(){
        return instance.get('breeds')
    }
}

export const imagesAPI = {
    getCatImageByBreed(data){
        return instance.get(`images/search?limit=100&breed_id=${data.breed_id}&sub_id=${data.userId}`)
    },
    getRandomCatImage(){
        return instance.get(`images/search`)
    }
}