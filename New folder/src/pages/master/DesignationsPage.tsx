import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import designationService from '../../services/designationService';
import departmentService from '../../services/departmentService';

interface Designation {
  id: number;
  Desgid: number;
  Desgname: string;
  shortname: string;
  departmentid: number;
  status: boolean;
  archive: boolean;
  gradeid: number;
}

interface Department {
  id: number;
  DeptName: string;
}

const DesignationsPage: React.FC = () => {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentDesignation, setCurrentDesignation] = useState<Designation | null>(null);
  const [formData, setFormData] = useState({ 
    Desgname: '',
    shortname: '',
    departmentid: '',
    status: true, 
    archive: false,
    gradeid: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartmentId, setFilterDepartmentId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [designationRes, departmentRes] = await Promise.all([
        designationService.getAllDesignations(),
        departmentService.getAllDepartments()
      ]);
      setDesignations(designationRes.data || []);
      setDepartments(departmentRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setDesignations([]);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (designation: Designation | null = null) => {
    setCurrentDesignation(designation);
    if (designation) {
      setFormData({ 
        Desgname: designation.Desgname,
        shortname: designation.shortname,
        departmentid: designation.departmentid.toString(),
        status: designation.status, 
        archive: designation.archive,
        gradeid: designation.gradeid?.toString() || ''
      });
    } else {
      setFormData({ 
        Desgname: '',
        shortname: '',
        departmentid: '',
        status: true, 
        archive: false,
        gradeid: ''
      });
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentDesignation(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = { 
        ...formData, 
        departmentid: parseInt(formData.departmentid),
        gradeid: formData.gradeid ? parseInt(formData.gradeid) : undefined
      };
      if (currentDesignation) {
        await designationService.updateDesignation(currentDesignation.id, submitData);
      } else {
        await designationService.createDesignation(submitData);
      }
      loadData();
      handleClose();
    } catch (error) {
      console.error('Error saving designation:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this designation?')) {
      try {
        await designationService.deleteDesignation(id);
        loadData();
      } catch (error) {
        console.error('Error deleting designation:', error);
      }
    }
  };

  const getDepartmentName = (departmentid: number) => {
    const department = departments.find(d => d.id === departmentid);
    return department ? department.DeptName : 'Unknown';
  };

  const filteredDesignations = designations.filter(designation => {
    const matchesSearch = designation.Desgname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         designation.shortname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartmentId === '' || designation.departmentid === parseInt(filterDepartmentId);
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Designations</h1>
            <p className="text-gray-600 mt-1">Manage designation master data</p>
          </div>
          <button
            onClick={() => handleOpen()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus size={20} />
            <span>Add Designation</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search designations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterDepartmentId}
            onChange={(e) => setFilterDepartmentId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.DeptName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading designations...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Archive</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDesignations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No designations found
                    </td>
                  </tr>
                ) : (
                  filteredDesignations.map((designation) => (
                    <tr key={designation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{designation.Desgid}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{designation.Desgname}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{designation.shortname}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getDepartmentName(designation.departmentid)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{designation.gradeid || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${designation.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {designation.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${designation.archive ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {designation.archive ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpen(designation)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(designation.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentDesignation ? 'Edit Designation' : 'Add Designation'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation Name
                </label>
                <input
                  type="text"
                  name="Desgname"
                  value={formData.Desgname}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Name
                </label>
                <input
                  type="text"
                  name="shortname"
                  value={formData.shortname}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  name="departmentid"
                  value={formData.departmentid}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.DeptName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade ID
                </label>
                <input
                  type="number"
                  name="gradeid"
                  value={formData.gradeid}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="archive"
                    checked={formData.archive}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Archive</span>
                </label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignationsPage;