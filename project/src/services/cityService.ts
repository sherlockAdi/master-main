import apiService from './api';

class CityService {
  async getAllCities() {
    return apiService.get('/master/address/cities');
  }

  async createCity(data: any) {
    return apiService.post('/master/address/cities', data);
  }

  async updateCity(id: number, data: any) {
    return apiService.put(`/master/address/cities/${id}`, data);
  }

  async deleteCity(id: number) {
    return apiService.delete(`/master/address/cities/${id}`);
  }
}

export default new CityService();