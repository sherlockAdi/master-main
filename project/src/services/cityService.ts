import apiService from './api';

class CityService {
  async getAllCities() {
    return apiService.get('/api/cities');
  }

  async getAllCitiessum(params: any = {}) {
    const query = new URLSearchParams(params).toString();
    return apiService.get(`/api/cities/sum${query ? `?${query}` : ''}`);
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

  async getUnassociatedCityStudentCount() {
    return apiService.get('/api/cities/students/unassociated-city-count');
  }
}

export default new CityService();