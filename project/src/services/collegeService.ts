import apiService from './api';

class CollegeService {
  async getAllColleges() {
    return apiService.get('/api/colleges');
  }

  async createCollege(data: any) {
    return apiService.post('/api/colleges', data);
  }

  async updateCollege(id: number, data: any) {
    return apiService.put(`/api/colleges/${id}`, data);
  }

  async deleteCollege(id: number) {
    return apiService.delete(`/api/colleges/${id}`);
  }
}

export default new CollegeService();