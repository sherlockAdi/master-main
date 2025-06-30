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

  async getUnassociatedStateStudentCount() {
    return apiService.get('/api/states/students/unassociated-state-count');
  }

  async getAllStatesSum(params: any = {}) {
    const query = new URLSearchParams(params).toString();
    return apiService.get(`/api/states/sum${query ? `?${query}` : ''}`);
  }
}

export default new StateService();