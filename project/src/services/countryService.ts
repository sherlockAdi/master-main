import apiService from './api';

class CountryService {
  async getAllCountries() {
    return apiService.get('/master/address/countries');
  }

  async createCountry(data: any) {
    return apiService.post('/master/address/countries', data);
  }

  async updateCountry(id: number, data: any) {
    return apiService.put(`/master/address/countries/${id}`, data);
  }

  async deleteCountry(id: number) {
    return apiService.delete(`/master/address/countries/${id}`);
  }
}

export default new CountryService();