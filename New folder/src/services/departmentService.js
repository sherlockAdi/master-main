import axios from 'axios';

const API_URL = 'http://localhost:5000/api/departments';

const getAllDepartments = () => axios.get(API_URL);
const getDepartment = (id) => axios.get(`${API_URL}/${id}`);
const createDepartment = (data) => axios.post(API_URL, data);
const updateDepartment = (id, data) => axios.put(`${API_URL}/${id}`, data);
const deleteDepartment = (id) => axios.delete(`${API_URL}/${id}`);

const departmentService = {
    getAllDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment
};

export default departmentService; 