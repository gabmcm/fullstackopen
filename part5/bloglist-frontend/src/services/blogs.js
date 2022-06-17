import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
let config

const setToken = newToken => {
    token = `bearer ${newToken}`
    config = {
        headers: { Authorization: token }
    }
}

const getAll = () => {
    const request = axios.get(baseUrl, config)
    return request.then(response => response.data)
}

const createBlog = async newObject => {
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject, config)
    return request.then(response => response.data)
}

const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`, config)
    return request.then(response => response.data)
}

export default { getAll, setToken, createBlog, update, remove }