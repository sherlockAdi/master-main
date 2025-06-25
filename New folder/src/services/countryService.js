import axios from 'axios';

const API_URL = 'http://localhost:5000/api/countries';

const getAllCountries = () => {
    return axios.get(API_URL);
};

const getCountry = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

const createCountry = (data) => {
    return axios.post(API_URL, data);
};

const updateCountry = (id, data) => {
    return axios.put(`${API_URL}/${id}`, data);
};

const deleteCountry = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

const countryService = {
    getAllCountries,
    getCountry,
    createCountry,
    updateCountry,
    deleteCountry
};

export default countryService; 