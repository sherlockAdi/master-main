import React, { useState } from 'react';
import employeeService from '../../services/employeeService';
import departmentService from '../../services/departmentService';
import designationService from '../../services/designationService';
import countryService from '../../services/countryService';
import stateService from '../../services/stateService';
import cityService from '../../services/cityService';

const EmployeeCard: React.FC = () => {
  const [employeeCode, setEmployeeCode] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  React.useEffect(() => {
    departmentService.getAllDepartments().then(res => setDepartments(res.data || []));
    designationService.getAllDesignations().then(res => setDesignations(res.data || []));
    countryService.getAllCountries().then(res => setCountries(res.data || []));
    stateService.getAllStates().then(res => setStates(res.data || []));
    cityService.getAllCities().then(res => setCities(res.data || []));
  }, []);

  // Helper functions
  const getDeptName = (id: number) => {
    const dept = departments.find(d => d.id == id);
    return dept ? dept.DeptName : '';
  };
  const getDesgName = (id: number) => {
    const desig = designations.find(d => d.id == id);
    return desig ? desig.Desgname : '';
  };
  const getCountryName = (id: number) => {
    const c = countries.find(c => c.id == id);
    return c ? (c.CountryName || c.name) : '';
  };
  const getStateName = (id: number) => {
    const s = states.find(s => s.id == id);
    return s ? (s.StateName || s.name) : '';
  };
  const getCityName = (id: number) => {
    const c = cities.find(c => c.id == id);
    return c ? (c.CityName || c.name) : '';
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEmployees([]);
    try {
      const params: any = {};
      if (employeeCode) params.employeecode = employeeCode;
      if (employeeName) params.search = employeeName;
      if (!employeeCode && !employeeName) {
        setError('Please enter employee code or name.');
        setLoading(false);
        return;
      }
      const res = await employeeService.getAllEmployees(params);
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        setEmployees(res.data);
      } else if (Array.isArray(res) && res.length > 0) {
        setEmployees(res);
      } else {
        setError('No employees found.');
      }
    } catch (err) {
      setError('Error occurred while searching.');
    } finally {
      setLoading(false);
    }
  };

  const renderEmployeeCard = (employee: any) => (
    <div key={employee.id} className="border rounded-lg p-4 bg-gray-50 mb-4">
      <div className="flex items-center gap-4 mb-4">
        {employee.image ? (
          <img src={employee.image} alt="Employee" className="w-20 h-20 rounded-full object-cover border-2 border-blue-200" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-3xl">
            <span>{employee.firstname?.[0] || '?'}</span>
          </div>
        )}
        <div>
          <div className="text-lg font-bold">{employee.firstname} {employee.lastname}</div>
          <div className="text-blue-600 font-semibold">{getDesgName(employee.designation) || employee.designationname || ''}</div>
          <div className="text-gray-500">{getDeptName(employee.department) || employee.departmentname || ''}</div>
          <div className="text-gray-400 text-sm">Employee Code: {employee.employeecode}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 text-sm">
        <div><span className="font-semibold">Mobile:</span> {employee.mobileno}</div>
        <div><span className="font-semibold">Office Email:</span> {employee.officeemail}</div>
        <div><span className="font-semibold">Status:</span> <span className={employee.status ? 'text-green-600' : 'text-red-600'}>{employee.status ? 'Active' : 'Inactive'}</span></div>
        <div><span className="font-semibold">Date of Joining:</span> {employee.dateofjoining?.slice(0,10)}</div>
        <div><span className="font-semibold">Date of Birth:</span> {employee.dateofbirth?.slice(0,10)}</div>
        <div><span className="font-semibold">Permanent Address:</span> {employee.permanentaddress}</div>
        <div><span className="font-semibold">City:</span> {getCityName(employee.city) || employee.cityname || ''}</div>
        <div><span className="font-semibold">State:</span> {getStateName(employee.state) || employee.statename || ''}</div>
        <div><span className="font-semibold">Country:</span> {getCountryName(employee.country) || employee.countryname || ''}</div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Employee Card</h2>
      <form onSubmit={handleSearch} className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Employee Code"
          value={employeeCode}
          onChange={e => setEmployeeCode(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="Enter Employee Name"
          value={employeeName}
          onChange={e => setEmployeeName(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {employees.length > 0 && (
        <div>
          {employees.map(renderEmployeeCard)}
        </div>
      )}
    </div>
  );
};

export default EmployeeCard; 