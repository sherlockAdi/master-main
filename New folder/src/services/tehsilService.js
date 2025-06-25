import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tehsils';

const getAllTehsils = () => {
    return axios.get(API_URL);
};

const getTehsil = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

const createTehsil = (data) => {
    return axios.post(API_URL, data);
};

const updateTehsil = (id, data) => {
    return axios.put(`${API_URL}/${id}`, data);
};

const deleteTehsil = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

const tehsilService = {
    getAllTehsils,
    getTehsil,
    createTehsil,
    updateTehsil,
    deleteTehsil
};

export default tehsilService; 