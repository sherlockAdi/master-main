import apiService from './api';

class DepartmentService {
  async getAllDepartments() {
    return apiService.get('/api/departments');
  }

  async createDepartment(data: any) {
    return apiService.post('/api/departments', data);
  }

  async updateDepartment(id: number, data: any) {
    return apiService.put(`/api/departments/${id}`, data);
  }

  async deleteDepartment(id: number) {
    return apiService.delete(`/api/departments/${id}`);
  }
}

export default new DepartmentService();