import apiService from './api';

class CountryService {
  async getAllCountries() {
    return apiService.get('/api/countries');
  }

  async createCountry(data: any) {
    return apiService.post('/api/countries', data);
  }

  async updateCountry(id: number, data: any) {
    return apiService.put(`/api/countries/${id}`, data);
  }

  async deleteCountry(id: number) {
    return apiService.delete(`/api/countries${id}`);
  }
}

export default new CountryService();