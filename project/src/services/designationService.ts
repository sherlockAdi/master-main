import apiService from './api';

class DesignationService {
  async getAllDesignations() {
    return apiService.get('/api/designations');
  }

  async createDesignation(data: any) {
    return apiService.post('/api/designations', data);
  }

  async updateDesignation(id: number, data: any) {
    return apiService.put(`/api/designations/${id}`, data);
  }

  async deleteDesignation(id: number) {
    return apiService.delete(`/api/designations/${id}`);
  }
}

export default new DesignationService();