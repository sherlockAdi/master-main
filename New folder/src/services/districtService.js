import axios from 'axios';

const API_URL = 'http://localhost:5000/api/districts';

const getAllDistricts = () => {
    return axios.get(API_URL);
};

const getDistrict = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

const createDistrict = (data) => {
    return axios.post(API_URL, data);
};

const updateDistrict = (id, data) => {
    return axios.put(`${API_URL}/${id}`, data);
};

const deleteDistrict = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

const districtService = {
    getAllDistricts,
    getDistrict,
    createDistrict,
    updateDistrict,
    deleteDistrict
};

export default districtService; 