import axios from 'axios';

const API_URL = 'http://localhost:5000/api/states';

const getAllStates = () => {
    return axios.get(API_URL);
};

const getState = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

const createState = (data) => {
    return axios.post(API_URL, data);
};

const updateState = (id, data) => {
    return axios.put(`${API_URL}/${id}`, data);
};

const deleteState = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

const stateService = {
    getAllStates,
    getState,
    createState,
    updateState,
    deleteState
};

export default stateService; 