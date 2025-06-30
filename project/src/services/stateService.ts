import apiService from './api';

class StateService {
  async getAllStates() {
    return apiService.get('/api/states');
  }

  async getAllStatessuma(params: any = {}) {
    const query = new URLSearchParams(params).toString();
    return apiService.get(`/api/states/sum${query ? `?${query}` : ''}`);
  }

  async createState(data: any) {
    return apiService.post('/api/states', data);
  }

  async updateState(id: number, data: any) {
    return apiService.put(`/api/states/${id}`, data);
  }

  async deleteState(id: number) {
    return apiService.delete(`/api/states/${id}`);
  }

  async getUnassociatedStudentCount() {
    return apiService.get('/api/states/students/unassociated-count');
  }
}

export default new StateService();