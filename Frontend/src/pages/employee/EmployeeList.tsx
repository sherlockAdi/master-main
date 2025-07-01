import React, { useEffect, useState } from 'react';
import employeeService from '../../services/employeeService';
import departmentService from '../../services/departmentService';
import designationService from '../../services/designationService';
import countryService from '../../services/countryService';
import stateService from '../../services/stateService';
import cityService from '../../services/cityService';
import { useNavigate } from 'react-router-dom';

interface Employee {
  id: number;
  firstname: string;
  lastname: string;
  department: number;
  designation: number;
  employeecode: string;
  mobileno: string;
  officeemail: string;
  status: boolean;
  [key: string]: any; // for all other fields
}

interface Department {
  id: number;
  DeptName: string;
}

interface Designation {
  id: number;
  Desgname: string;
}

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100, 'all'];

const initialForm = {
  firstname: '',
  lastname: '',
  department: '',
  designation: '',
  employeecode: '',
  mobileno: '',
  officeemail: '',
  status: true,
};

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'all'>(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    department: '',
    designation: '',
    employeecode: '',
    status: '',
  });
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState(initialForm);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOptions();
    countryService.getAllCountries().then(res => setCountries(res.data || []));
    stateService.getAllStates().then(res => setStates(res.data || []));
    cityService.getAllCities().then(res => setCities(res.data || []));
  }, []);

  useEffect(() => {
    if (filters.department) {
      designationService.getAllDesignations(filters.department).then(res => {
        setDesignations(res.data || []);
      });
    } else {
      designationService.getAllDesignations().then(res => {
        setDesignations(res.data || []);
      });
    }
  }, [filters.department]);

  useEffect(() => {
    fetchEmployees();
  }, [page, pageSize, filters, search]);

  const fetchOptions = async () => {
    try {
      const [deptRes, desigRes] = await Promise.all([
        departmentService.getAllDepartments(),
        designationService.getAllDesignations(),
      ]);
      setDepartments(deptRes.data || []);
      setDesignations(desigRes.data || []);
    } catch (err) {
      setDepartments([]);
      setDesignations([]);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        pageSize: pageSize === 'all' ? 1000 : pageSize, // fallback for 'all'
        ...filters,
      };
      if (search) params.search = search;
      const res = await employeeService.getAllEmployees(params);
      setEmployees(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      setEmployees([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const openAddModal = () => {
    setEditEmployee(null);
    setForm(initialForm);
    setShowModal(true);
    designationService.getAllDesignations().then(res => setDesignations(res.data || []));
  };

  const openEditModal = (emp: Employee) => {
    navigate('/employee/registration', { state: { employee: emp } });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditEmployee(null);
    setForm(initialForm);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setForm(prev => ({ ...prev, [name]: newValue }));
    if (name === 'department') {
      setForm(prev => ({ ...prev, designation: '' }));
      designationService.getAllDesignations(value).then(res => setDesignations(res.data || []));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const submitData = {
        ...form,
        department: parseInt(form.department),
        designation: parseInt(form.designation),
      };
      if (editEmployee) {
        await employeeService.updateEmployee(editEmployee.id, submitData);
      } else {
        await employeeService.createEmployee(submitData);
      }
      closeModal();
      fetchEmployees();
    } catch (err) {
      // handle error
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await employeeService.deleteEmployee(deleteId);
      setDeleteId(null);
      fetchEmployees();
    } catch (err) {
      // handle error
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRowClick = (emp: Employee) => {
    setSelectedEmployee(emp);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedEmployee(null);
  };

  const totalPages = pageSize === 'all' ? 1 : Math.max(1, Math.ceil(total / (typeof pageSize === 'number' ? pageSize : 1)));
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getDeptName = (id: number) => {
    const dept = departments.find(d => d.id == id);
    return dept ? dept.DeptName : '';
  };
  const getDesgname = (id: number) => {
    const desig = designations.find(d => d.id ==  id);
    return desig ? desig.Desgname : '';
  };
  const getCountryName = (id: number) => {
    const c = countries.find(c => c.id == id);
    return c ? (c.country) : '';
  };
  const getStateName = (id: number) => {
    const s = states.find(s => s.id == id);
    return s ? (s.state ) : '';
  };
  const getCityName = (id: number) => {
    const c = cities.find(c => c.id == id);
    return c ? (c.city ) : '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Employee List</h2>
          <p className="text-gray-600 mt-1">Paginated, filterable list of employees</p>
        </div>
        <button
          onClick={() => navigate('/employee/registration')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors mt-4 md:mt-0"
        >
          Add Employee
        </button>
      </div>
      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by name or code..."
          value={search}
          onChange={handleSearchChange}
          className="px-3 py-2 border border-gray-300 rounded-lg w-64"
        />
        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.DeptName}</option>
          ))}
        </select>
        <select
          name="designation"
          value={filters.designation}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Designations</option>
          {designations.map((d) => (
            <option key={d.id} value={d.id}>{d.Desgname}</option>
          ))}
        </select>
        <input
          type="text"
          name="employeecode"
          value={filters.employeecode}
          onChange={handleFilterChange}
          placeholder="Employee Code"
          className="px-3 py-2 border border-gray-300 rounded-lg"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
        <label className="mr-2">Rows per page:</label>
        <select
          value={pageSize}
          onChange={e => {
            const val = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
            setPageSize(val);
            setPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          {PAGE_SIZE_OPTIONS.map(size => (
            <option key={size} value={size}>{size === 'all' ? 'All' : size}</option>
          ))}
        </select>
        <button disabled={page === 1 || pageSize === 'all'} onClick={() => setPage(page - 1)} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={pageSize === 'all' || page >= totalPages} onClick={() => setPage(page + 1)} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
        <span className="ml-auto text-sm text-gray-600">Total Employees: <span className="font-semibold">{total}</span></span>
      </div>
      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading employees...</p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {employees.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">No employees found</div>
            ) : (
              employees.map((employee) => (
                <div
                  key={employee.id}
                  className="bg-white/80 rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col items-center cursor-pointer hover:shadow-2xl transition-all group"
                  onClick={() => handleRowClick(employee)}
                >
                  {employee.image ? (
                    <img src={employee.image} alt="Employee" className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shadow mb-3" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-400 text-3xl border-4 border-blue-200 shadow mb-3">
                      <span>{employee.firstname?.[0] || '?'}</span>
                    </div>
                  )}
                  <div className="text-lg font-bold text-gray-900 mb-1">{employee.firstname} {employee.lastname}</div>
                  <div className="text-blue-600 font-semibold mb-1">{getDesgname(employee.designation)}</div>
                  <div className="text-gray-500 mb-1">{getDeptName(employee.department)}</div>
                  <div className="text-gray-400 text-xs mb-2">Code: {employee.employeecode}</div>
                  <div className="mb-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-${employee.status ? 'green' : 'red'}-100 text-${employee.status ? 'green' : 'red'}-700`}>
                      {employee.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={e => { e.stopPropagation(); openEditModal(employee); }}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-xs font-semibold transition-all shadow"
                    >Edit</button>
                    <button
                      onClick={e => { e.stopPropagation(); setDeleteId(employee.id); }}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-xs font-semibold transition-all shadow"
                    >Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {/* Add/Edit Drawer */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1" onClick={closeModal} />
          <div className="w-full max-w-md bg-white shadow-2xl h-full p-8 overflow-y-auto relative animate-slideInRight border-l border-blue-300 rounded-l-3xl flex flex-col justify-center">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-6 text-blue-700 text-center">{editEmployee ? 'Edit Employee' : 'Add Employee'}</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex gap-3">
                <input
                  type="text"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleFormChange}
                  placeholder="First Name"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
                  required
                />
                <input
                  type="text"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleFormChange}
                  placeholder="Last Name"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
              <div className="flex gap-3">
                <select
                  name="department"
                  value={form.department}
                  onChange={handleFormChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.DeptName}</option>
                  ))}
                </select>
                <select
                  name="designation"
                  value={form.designation}
                  onChange={handleFormChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
                  required
                >
                  <option value="">Select Designation</option>
                  {designations.map((d) => (
                    <option key={d.id} value={d.id}>{d.Desgname}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                name="employeecode"
                value={form.employeecode}
                onChange={handleFormChange}
                placeholder="Employee Code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
                required
              />
              <input
                type="text"
                name="mobileno"
                value={form.mobileno}
                onChange={handleFormChange}
                placeholder="Mobile No"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
                required
              />
              <input
                type="email"
                name="officeemail"
                value={form.officeemail}
                onChange={handleFormChange}
                placeholder="Office Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
                required
              />
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="status"
                  checked={form.status}
                  onChange={handleFormChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-gray-700 font-medium">Active</span>
              </label>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-4 py-3 rounded-lg transition-colors text-lg font-semibold shadow"
                disabled={modalLoading}
              >
                {modalLoading ? 'Saving...' : (editEmployee ? 'Update' : 'Add')}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
            <h3 className="text-lg font-bold mb-4">Delete Employee</h3>
            <p>Are you sure you want to delete this employee?</p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700"
                disabled={deleteLoading}
              >Cancel</button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white"
                disabled={deleteLoading}
              >{deleteLoading ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
      {/* Employee Detail Drawer */}
      {drawerOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1" onClick={closeDrawer} />
          <div className="w-full max-w-md bg-white shadow-2xl h-full p-8 overflow-y-auto relative animate-slideInRight border-l border-blue-300 rounded-l-3xl">
            <button
              onClick={closeDrawer}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center mb-8">
              {selectedEmployee.image ? (
                <img
                  src={selectedEmployee.image}
                  alt="Employee"
                  className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow mb-3"
                  onError={e => (e.currentTarget.style.display = 'none')}
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mb-3 text-4xl">
                  <span>{selectedEmployee.firstname?.[0] || '?'}</span>
                </div>
              )}
              <div className="text-2xl font-bold text-gray-900">{selectedEmployee.firstname} {selectedEmployee.lastname}</div>
              <div className="text-blue-600 font-semibold mt-1">{getDesgname(selectedEmployee.designation)}</div>
              <div className="text-gray-500">{getDeptName(selectedEmployee.department)}</div>
              <div className="text-gray-400 text-sm mt-1">Employee Code: {selectedEmployee.employeecode}</div>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4 text-gray-700">
              <div><span className="font-semibold">Date of Joining:</span> {selectedEmployee.dateofjoining?.slice(0,10) || '-'}</div>
              <div><span className="font-semibold">Gender:</span> {selectedEmployee.gender || '-'}</div>
              <div><span className="font-semibold">Mobile:</span> {selectedEmployee.mobileno || '-'}</div>
              <div><span className="font-semibold">Office Email:</span> {selectedEmployee.officeemail || '-'}</div>
              <div><span className="font-semibold">Status:</span> <span className={selectedEmployee.status ? 'text-green-600' : 'text-red-600'}>{selectedEmployee.status ? 'Active' : 'Inactive'}</span></div>
              <div><span className="font-semibold">Date of Birth:</span> {selectedEmployee.dateofbirth?.slice(0,10) || '-'}</div>
              <div><span className="font-semibold">Permanent Address:</span> {selectedEmployee.permanentaddress || '-'}</div>
              <div><span className="font-semibold">City:</span> {getCityName(selectedEmployee.city) || '-'}</div>
              <div><span className="font-semibold">State:</span> {getStateName(selectedEmployee.state) || '-'}</div>
              <div><span className="font-semibold">Country:</span> {getCountryName(selectedEmployee.country) || '-'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList; 