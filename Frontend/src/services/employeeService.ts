import apiService from './api';

function buildQuery(params: any) {
  if (!params) return '';
  const esc = encodeURIComponent;
  return (
    '?' +
    Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&')
  );
}

class EmployeeService {
  async getAllEmployees(params?: any) {
    const query = buildQuery(params);
    return apiService.get('/api/employees' + query);
  }

  async getEmployeeById(id: number | string) {
    return apiService.get(`/api/employees/${id}`);
  }

  async createEmployee(data: any) {
    return apiService.post('/api/employees', data);
  }

  async updateEmployee(id: number, data: any) {
    return apiService.put(`/api/employees/${id}`, data);
  }

  async deleteEmployee(id: number) {
    return apiService.delete(`/api/employees/${id}`);
  }
}

export default new EmployeeService(); 