import apiService from './api';

class StateService {
  async getAllStates() {
    return apiService.get('/api/states');
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
}

export default new StateService();