import apiService from './api';

class BranchService {
  async getAllBranches() {
    return apiService.get('/master/branches');
  }

  async createBranch(data: any) {
    return apiService.post('/master/branches', data);
  }

  async updateBranch(id: number, data: any) {
    return apiService.put(`/master/branches/${id}`, data);
  }

  async deleteBranch(id: number) {
    return apiService.delete(`/master/branches/${id}`);
  }
}

export default new BranchService();