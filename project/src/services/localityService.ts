// src/services/localityService.ts
import apiService from './api';

class LocalityService {
    async getAllLocalities() {
        return apiService.get('/api/localities');
    }

    async getAllLocalitiesSum(params: any = {}) {
        const query = new URLSearchParams(params).toString();
        return apiService.get(`/api/localities/sum${query ? `?${query}` : ''}`);
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

    async getUnassociatedLocalityStudentCount() {
        return apiService.get('/api/localitys/students/unassociated-locality-count');
    }
}

export default new LocalityService();
