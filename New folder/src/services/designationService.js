import axios from 'axios';

const API_URL = 'http://localhost:5000/api/designations';

const getAllDesignations = () => axios.get(API_URL);
const getDesignation = (id) => axios.get(`${API_URL}/${id}`);
const createDesignation = (data) => axios.post(API_URL, data);
const updateDesignation = (id, data) => axios.put(`${API_URL}/${id}`, data);
const deleteDesignation = (id) => axios.delete(`${API_URL}/${id}`);

const designationService = {
    getAllDesignations,
    getDesignation,
    createDesignation,
    updateDesignation,
    deleteDesignation
};

export default designationService; 