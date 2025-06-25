import apiService from './api';

class DepartmentService {
  async getAllDepartments() {
    return apiService.get('/master/departments');
  }

  async createDepartment(data: any) {
    return apiService.post('/master/departments', data);
  }

  async updateDepartment(id: number, data: any) {
    return apiService.put(`/master/departments/${id}`, data);
  }

  async deleteDepartment(id: number) {
    return apiService.delete(`/master/departments/${id}`);
  }
}

export default new DepartmentService();