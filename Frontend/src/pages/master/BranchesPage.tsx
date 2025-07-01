import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import branchService from '../../services/branchService';
import collegeService from '../../services/collegeService';
import { HiOutlineIdentification, HiOutlineAcademicCap, HiOutlineBuildingOffice2, HiOutlineMapPin, HiOutlinePhone, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineArchiveBox } from 'react-icons/hi2';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Branch {
  id: number;
  Branchid: number;
  Branchname: string;
  shortname: string;
  collegeid: number;
  cityname?: string;
  statename?: string;
  countryname?: string;
  Address?: string;
  phoneNo?: string;
  email?: string;
  status: boolean;
  archive: boolean;
  ATMBCode?: string;
}

interface College {
  id: number;
  collegename: string;
}

const BranchesPage: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({
    Branchname: '',
    shortname: '',
    collegeid: '',
    cityname: '',
    statename: '',
    countryname: '',
    Address: '',
    phoneNo: '',
    email: '',
    status: true,
    archive: false,
    ATMBCode: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCollegeId, setFilterCollegeId] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [branchRes, collegeRes] = await Promise.all([
        branchService.getAllBranches(),
        collegeService.getAllColleges()
      ]);
      setBranches(branchRes.data || []);
      setColleges(collegeRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setBranches([]);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (branch: Branch | null = null) => {
    setCurrentBranch(branch);
    if (branch) {
      setFormData({
        Branchname: branch.Branchname,
        shortname: branch.shortname,
        collegeid: branch.collegeid.toString(),
        cityname: branch.cityname || '',
        statename: branch.statename || '',
        countryname: branch.countryname || '',
        Address: branch.Address || '',
        phoneNo: branch.phoneNo || '',
        email: branch.email || '',
        status: branch.status,
        archive: branch.archive,
        ATMBCode: branch.ATMBCode || ''
      });
    } else {
      setFormData({
        Branchname: '',
        shortname: '',
        collegeid: '',
        cityname: '',
        statename: '',
        countryname: '',
        Address: '',
        phoneNo: '',
        email: '',
        status: true,
        archive: false,
        ATMBCode: ''
      });
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentBranch(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = { ...formData, collegeid: parseInt(formData.collegeid) };
      if (currentBranch) {
        await branchService.updateBranch(currentBranch.id, submitData);
      } else {
        await branchService.createBranch(submitData);
      }
      loadData();
      handleClose();
    } catch (error) {
      console.error('Error saving branch:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await branchService.deleteBranch(id);
        loadData();
      } catch (error) {
        console.error('Error deleting branch:', error);
      }
    }
  };

  const getCollegeName = (collegeid: number) => {
    const college = colleges.find(c => c.id === collegeid);
    return college ? college.collegename : 'Unknown';
  };

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.Branchname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.shortname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (branch.cityname && branch.cityname.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCollege = filterCollegeId === '' || branch.collegeid === parseInt(filterCollegeId);
    return matchesSearch && matchesCollege;
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Branches</h1>
            <p className="text-gray-600 mt-1">Manage branch master data</p>
          </div>
          <button
            onClick={() => handleOpen()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus size={20} />
            <span>Add Branch</span>
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
              placeholder="Search branches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCollegeId}
            onChange={(e) => setFilterCollegeId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Colleges</option>
            {colleges.map((college) => (
              <option key={college.id} value={college.id}>
                {college.collegename}
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
            <p className="text-gray-600 mt-4">Loading branches...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-blue-100 shadow-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider rounded-tl-2xl">
                    <button onClick={() => handleSort('Branchid')} className="flex items-center gap-1 focus:outline-none">
                      <HiOutlineIdentification className="inline mr-1" />ID {sortBy === 'Branchid' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <button onClick={() => handleSort('Branchname')} className="flex items-center gap-1 focus:outline-none">
                      <HiOutlineAcademicCap className="inline mr-1" />Branch Name {sortBy === 'Branchname' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <button onClick={() => handleSort('shortname')} className="flex items-center gap-1 focus:outline-none">
                      Short Name {sortBy === 'shortname' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <button onClick={() => handleSort('collegeid')} className="flex items-center gap-1 focus:outline-none">
                      <HiOutlineBuildingOffice2 className="inline mr-1" />College {sortBy === 'collegeid' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <button onClick={() => handleSort('cityname')} className="flex items-center gap-1 focus:outline-none">
                      <HiOutlineMapPin className="inline mr-1" />City {sortBy === 'cityname' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <button onClick={() => handleSort('phoneNo')} className="flex items-center gap-1 focus:outline-none">
                      <HiOutlinePhone className="inline mr-1" />Phone {sortBy === 'phoneNo' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <button onClick={() => handleSort('status')} className="flex items-center gap-1 focus:outline-none">
                      Status {sortBy === 'status' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <button onClick={() => handleSort('archive')} className="flex items-center gap-1 focus:outline-none">
                      Archive {sortBy === 'archive' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBranches.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      No branches found
                    </td>
                  </tr>
                ) : (
                  filteredBranches.map((branch) => (
                    <tr key={branch.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{branch.Branchid}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{branch.Branchname}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{branch.shortname}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getCollegeName(branch.collegeid)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{branch.cityname || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{branch.phoneNo || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${branch.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {branch.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${branch.archive ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {branch.archive ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpen(branch)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(branch.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentBranch ? 'Edit Branch' : 'Add Branch'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    name="Branchname"
                    value={formData.Branchname}
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
                    College
                  </label>
                  <select
                    name="collegeid"
                    value={formData.collegeid}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select College</option>
                    {colleges.map((college) => (
                      <option key={college.id} value={college.id}>
                        {college.collegename}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ATM Branch Code
                  </label>
                  <input
                    type="text"
                    name="ATMBCode"
                    value={formData.ATMBCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="cityname"
                    value={formData.cityname}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="statename"
                    value={formData.statename}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="countryname"
                    value={formData.countryname}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="Address"
                  value={formData.Address}
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

export default BranchesPage;