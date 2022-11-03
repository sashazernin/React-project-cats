import * as axios from "axios";

const instance = axios.default.create({
    baseURL: 'https://api.thecatapi.com/v1/',
    headers: {
        'x-api-key': 'live_rCS7q2EGZYaPuzWLUaQsjDru9ODC4aeQO7M2SZodFwnCFyGJFzRs2RpVLUiREliS'
    }
})

export const voteApi = {
    createAVote(data) {
        return instance.post('votes', data)
    },
    getAllVotes(user) {
        return instance.get(`votes?sub_id=${user}`)
    },
    DeleteFromVote(voteId) {
        return instance.delete(`votes/${voteId}`)
    }
}

export const getRandomCatImage = () => {
    console.warn('use the imagesAPI.getRandomCatImage()')
    return imagesAPI.getRandomCatImage()
}

export const favoriteApi = {
    createAFavorite(data) {
        return instance.post('favourites', data)
    },
    deleteFromFavorite(favoriteId) {
        return instance.delete(`favourites/${favoriteId}`)
    },
    getAllFavorites(userId) {
        return instance.get(`favourites?sub_id=${userId}`)
    }
}

export const breedsApi = {
    getBreedsList() {
        console.warn('use the listApi.getBreedsList()')
        return instance.get('breeds')
    }
}

export const listApi = {
    getBreedsList() {
        return instance.get('breeds')
    },
    getCategoriesList() {
        return instance.get('categories')
    }
}

export const imagesAPI = {
    getCatImages(data) {
        return instance.get(`images/search?limit=20&page=${data.page}&breed_id=${data.breed_id}&mime_types=${data.type}&category_ids=${data.category}&order=Asc&sub_id=${data.userId}`)
    },
    getRandomCatImage() {
        return instance.get(`images/search`)
    },
    getUploadImages(data){
        return instance.get(`images?limit=20&page=${data.page}&sub_id=${data.userId}`)
    },
    uploadImage(data){
        return instance.post('images/upload', data,{
            headers: {
                'Content-Type':'multipart/form-data'
            }
        })
    },
    deleteUploadImage(data){
        return instance.delete(`images/${data}`)
    }
}