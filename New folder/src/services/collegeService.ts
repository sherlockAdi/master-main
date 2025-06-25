import apiService from './api';

class CollegeService {
  async getAllColleges() {
    return apiService.get('/master/colleges');
  }

  async createCollege(data: any) {
    return apiService.post('/master/colleges', data);
  }

  async updateCollege(id: number, data: any) {
    return apiService.put(`/master/colleges/${id}`, data);
  }

  async deleteCollege(id: number) {
    return apiService.delete(`/master/colleges/${id}`);
  }
}

export default new CollegeService();