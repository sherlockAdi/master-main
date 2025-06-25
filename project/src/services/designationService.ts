import apiService from './api';

class DesignationService {
  async getAllDesignations() {
    return apiService.get('/master/designations');
  }

  async createDesignation(data: any) {
    return apiService.post('/master/designations', data);
  }

  async updateDesignation(id: number, data: any) {
    return apiService.put(`/master/designations/${id}`, data);
  }

  async deleteDesignation(id: number) {
    return apiService.delete(`/master/designations/${id}`);
  }
}

export default new DesignationService();