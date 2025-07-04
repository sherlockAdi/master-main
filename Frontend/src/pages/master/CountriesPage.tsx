import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import countryService from '../../services/countryService';
import stateService from '../../services/stateService';

interface Country {
  conid: number;
  country: string;
  status: boolean;
  archive: boolean;
  TotalStudents: string;
  TotalBranches: string;

}

const CountriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [formData, setFormData] = useState({ country: '', status: true, archive: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'all'>(10);
  const [total, setTotal] = useState(0);
  const [totalStudentsInView, setTotalStudentsInView] = useState(0);
  const [unassociatedStudentCount, setUnassociatedStudentCount] = useState(0);
  const [sortBy, setSortBy] = useState('conid');
  const [sortOrder, setSortOrder] = useState('asc');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPage(1); // Reset to first page on search
  }, [searchTerm]);

  useEffect(() => {
    loadData();
    loadUnassociatedStudentCount();
  }, [page, pageSize, searchTerm, sortBy, sortOrder]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [countryRes, stateRes] = await Promise.all([
        countryService.getAllCountriesSum({ page, limit: pageSize, search: searchTerm, sortBy, sortOrder }),
        stateService.getAllStates()
      ]);
      setCountries(countryRes.data || []);
      setTotal(countryRes.total || 0);
      setTotalStudentsInView(countryRes.totalStudentsInView || 0);
      setStates(stateRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const loadUnassociatedStudentCount = async () => {
    try {
      const res = await countryService.getUnassociatedCountryStudentCount();
      setUnassociatedStudentCount(res.data.count);
    } catch (error) {
      console.error("Failed to load unassociated student count:", error);
    }
  };

  const handleOpen = (country: Country | null = null) => {
    setCurrentCountry(country);
    if (country) {
      setFormData({ country: country.country, status: country.status, archive: country.archive });
    } else {
      setFormData({ country: '', status: true, archive: false });
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentCountry(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentCountry) {
        await countryService.updateCountry(currentCountry.conid, formData);
      } else {
        await countryService.createCountry(formData);
      }
      loadData();
      handleClose();
    } catch (error) {
      console.error('Error saving country:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      try {
        await countryService.deleteCountry(id);
        loadData();
      } catch (error) {
        console.error('Error deleting country:', error);
      }
    }
  };

  const hasStates = (conid: number) => {
    return states.some(s => s.conid === conid);
  };

  const hasRelatedData = (country: Country) => {
    const hasStatesData = hasStates(country.conid);
    const hasBranches = parseInt(country.TotalBranches || '0') > 0;
    const hasStudents = parseInt(country.TotalStudents || '0') > 0;
    
    return hasStatesData || hasBranches || hasStudents;
  };

  const getDeleteDisabledReason = (country: Country) => {
    const reasons = [];
    if (hasStates(country.conid)) reasons.push('states');
    if (parseInt(country.TotalBranches || '0') > 0) reasons.push('branches');
    if (parseInt(country.TotalStudents || '0') > 0) reasons.push('students');
    
    return reasons.length > 0 ? `Cannot delete - has linked ${reasons.join(', ')}` : 'Delete';
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleCountryClick = (countryId: number) => {
    navigate(`/master/states?country=${countryId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Countries</h1>
            <p className="text-gray-600 mt-1">Manage country master data</p>
          </div>
          <button
            onClick={() => handleOpen()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus size={20} />
            <span>Add Country</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading countries...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                {[10, 20, 30, 50, 100].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
                <option value="all">All</option>
              </select>
              <button disabled={page === 1 || pageSize === 'all'} onClick={() => setPage(page - 1)} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
              <span>Page {page} of {pageSize === 'all' ? 1 : Math.max(1, Math.ceil(total / (typeof pageSize === 'number' ? pageSize : 1)))}</span>
              <button disabled={pageSize === 'all' || page >= Math.ceil(total / (typeof pageSize === 'number' ? pageSize : 1))} onClick={() => setPage(page + 1)} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
              <span className="ml-auto text-sm text-gray-600">Total Countries: <span className="font-semibold">{total}</span></span>
              <span className="ml-4 text-sm text-gray-600">Students in View: <span className="font-semibold">{totalStudentsInView}</span></span>
              <span className="ml-4 text-sm text-red-600">Unassociated: <span className="font-semibold">{unassociatedStudentCount}</span></span>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort('conid')} className="flex items-center">
                      ID {sortBy === 'conid' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort('country')} className="flex items-center">
                      Country {sortBy === 'country' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State Count</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     <button onClick={() => handleSort('TotalBranches')} className="flex items-center">
                      Branch Count {sortBy === 'TotalBranches' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort('TotalStudents')} className="flex items-center">
                      Student Count {sortBy === 'TotalStudents' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort('status')} className="flex items-center">
                      Status {sortBy === 'status' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     <button onClick={() => handleSort('archive')} className="flex items-center">
                      Archive {sortBy === 'archive' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {countries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No countries found
                    </td>
                  </tr>
                ) : (
                  countries.map((country) => {
                    const disabled = hasRelatedData(country);
                    const stateCount = states.filter(s => s.conid === country.conid).length;

                    return (
                      <tr key={country.conid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{country.conid}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <button
                            onClick={() => handleCountryClick(country.conid)}
                            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                          >
                            {country.country}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stateCount}</td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{country?.TotalBranches}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{country?.TotalStudents}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${country.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {country.status ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${country.archive ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                            {country.archive ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpen(country)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => !disabled && handleDelete(country.conid)}
                              disabled={disabled}
                              className={`p-1 rounded ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                              title={getDeleteDisabledReason(country)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
              {currentCountry ? 'Edit Country' : 'Add Country'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country Name
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
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

export default CountriesPage;