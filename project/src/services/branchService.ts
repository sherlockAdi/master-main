import apiService from './api';

class BranchService {
  async getAllBranches() {
    return apiService.get('/api/branches');
  }

  async createBranch(data: any) {
    return apiService.post('/api/branches', data);
  }

  async updateBranch(id: number, data: any) {
    return apiService.put(`/api/branches/${id}`, data);
  }

  async deleteBranch(id: number) {
    return apiService.delete(`/api/branches/${id}`);
  }
}

export default new BranchService();