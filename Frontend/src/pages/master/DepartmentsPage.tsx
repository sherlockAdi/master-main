import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import departmentService from '../../services/departmentService';
import { HiOutlineOfficeBuilding, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineGlobe, HiOutlineArchive, HiOutlineEye, HiOutlineEyeOff, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

interface Department {
  id: number;
  Deptid: number;
  DeptName: string;
  shortname: string;
  status: boolean;
  archive: boolean;
  showonwebsite: boolean;
  aboutdeptt: string;
}

const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    DeptName: '',
    shortname: '',
    status: true,
    archive: false,
    showonwebsite: false,
    aboutdeptt: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await departmentService.getAllDepartments();
      setDepartments(response.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (department: Department | null = null) => {
    setCurrentDepartment(department);
    if (department) {
      setFormData({
        DeptName: department.DeptName,
        shortname: department.shortname,
        status: department.status,
        archive: department.archive,
        showonwebsite: department.showonwebsite,
        aboutdeptt: department.aboutdeptt
      });
    } else {
      setFormData({
        DeptName: '',
        shortname: '',
        status: true,
        archive: false,
        showonwebsite: false,
        aboutdeptt: ''
      });
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentDepartment(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentDepartment) {
        await departmentService.updateDepartment(currentDepartment.id, formData);
      } else {
        await departmentService.createDepartment(formData);
      }
      loadData();
      handleClose();
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentService.deleteDepartment(id);
        loadData();
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.DeptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.shortname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
            <p className="text-gray-600 mt-1">Manage department master data</p>
          </div>
          <button
            onClick={() => handleOpen()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus size={20} />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-blue-100 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading departments...</p>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-blue-100 shadow-sm">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider rounded-tl-2xl"><HiOutlineOfficeBuilding className="inline mr-1" />ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Short Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider"><HiOutlineGlobe className="inline mr-1" />Website</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Archive</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/60 divide-y divide-blue-50">
              {filteredDepartments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No departments found
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((department) => (
                  <tr key={department.id} className="hover:bg-blue-50/70 transition-all cursor-pointer group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold rounded-l-xl">{department.Deptid}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700 flex items-center gap-2"><HiOutlineOfficeBuilding className="inline mr-1" />{department.DeptName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{department.shortname}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${department.showonwebsite ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {department.showonwebsite ? <HiOutlineEye className="w-4 h-4" /> : <HiOutlineEyeOff className="w-4 h-4" />}
                        {department.showonwebsite ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${department.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {department.status ? <HiOutlineCheckCircle className="w-4 h-4" /> : <HiOutlineXCircle className="w-4 h-4" />}
                        {department.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${department.archive ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                        <HiOutlineArchive className="w-4 h-4" />
                        {department.archive ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2 rounded-r-xl" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpen(department)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full shadow"
                        title="Edit"
                      >
                        <HiOutlinePencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(department.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-full shadow"
                        title="Delete"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentDepartment ? 'Edit Department' : 'Add Department'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  name="DeptName"
                  value={formData.DeptName}
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
                  About Department
                </label>
                <textarea
                  name="aboutdeptt"
                  value={formData.aboutdeptt}
                  onChange={handleChange}
                  rows={3}
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
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="showonwebsite"
                    checked={formData.showonwebsite}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Show on Website</span>
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

export default DepartmentsPage;