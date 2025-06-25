import apiService from './api';

class StateService {
  async getAllStates() {
    return apiService.get('/master/address/states');
  }

  async createState(data: any) {
    return apiService.post('/master/address/states', data);
  }

  async updateState(id: number, data: any) {
    return apiService.put(`/master/address/states/${id}`, data);
  }

  async deleteState(id: number) {
    return apiService.delete(`/master/address/states/${id}`);
  }
}

export default new StateService();