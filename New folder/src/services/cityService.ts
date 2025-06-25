import apiService from './api';

class CityService {
  async getAllCities() {
    return apiService.get('/api/cities');
  }

  async createCity(data: any) {
    return apiService.post('/api/cities', data);
  }

  async updateCity(id: number, data: any) {
    return apiService.put(`/api/cities/${id}`, data);
  }

  async deleteCity(id: number) {
    return apiService.delete(`/api/cities/${id}`);
  }
}

export default new CityService();