// src/services/localityService.ts
import apiService from './api';

class LocalityService {
    async getAllLocalities() {
        return apiService.get('/api/localities');
    }

    async getAllLocalitiesSum() {
        return apiService.get('/api/localities/sum');
    }

    async createLocality(data: any) {
        return apiService.post('/api/localities', data);
    }

    async updateLocality(id: number, data: any) {
        return apiService.put(`/api/localities/${id}`, data);
    }

    async deleteLocality(id: number) {
        return apiService.delete(`/api/localities/${id}`);
    }
}

export default new LocalityService();
