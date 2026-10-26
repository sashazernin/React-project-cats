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
    getAllVotes(user, page = 0, limit = 20) {
        return instance.get(
            `votes?sub_id=${encodeURIComponent(user)}&limit=${limit}&page=${page}&order=DESC`
        )
    },
}

export const favoriteApi = {
    createAFavorite(data) {
        return instance.post('favourites', data)
    },
    deleteFromFavorite(favoriteId) {
        return instance.delete(`favourites/${favoriteId}`)
    },
    getAllFavorites(userId, page = 0, limit = 20) {
        return instance.get(
            `favourites?sub_id=${encodeURIComponent(userId)}&limit=${limit}&page=${page}&order=DESC`
        )
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

function buildImageSearchParams(data) {
    const params = new URLSearchParams({
        limit: String(data.pageSize ?? 20),
        page: String(data.page ?? 0),
        order: 'DESC',
    })
    if (data.userId) {
        params.set('sub_id', data.userId)
    }
    if (data.breed_id) {
        params.set('breed_id', data.breed_id)
    }
    if (data.category) {
        params.set('category_ids', data.category)
    }
    if (data.type) {
        params.set('mime_types', data.type)
    }
    return params
}

export const imagesAPI = {
    getCatImages(data) {
        return instance.get(`images/search?${buildImageSearchParams(data).toString()}`)
    },
    getRandomCatImage() {
        return instance.get(`images/search`)
    },
    getImageById(imageId) {
        return instance.get(`images/${imageId}`)
    },
    getUploadImages(data) {
        const limit = data.pageSize ?? 20
        return instance.get(
            `images?limit=${limit}&page=${data.page ?? 0}&sub_id=${encodeURIComponent(data.userId)}`
        )
    },
    uploadImage(formData) {
        return instance.post('images/upload', formData)
    },
    deleteUploadImage(data){
        return instance.delete(`images/${data}`)
    }
}