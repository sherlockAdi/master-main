import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import cityService from '../../services/cityService';
import stateService from '../../services/stateService';

interface City {
  cityid: number;
  city: string;
  stateid: number;
  status: boolean;
  archive: boolean;
  fyid?: number;
  target?: number;
  ATMDCode?: string;
  TotalStudents: string;
  TotalBranches: string;
}

interface State {
  stateid: number;
  state: string;
}

const CitiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [formData, setFormData] = useState({
    stateid: '',
    city: '',
    status: true,
    archive: false,
    fyid: '',
    target: '',
    ATMDCode: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStateId, setFilterStateId] = useState(() => searchParams.get('state') || '');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'all'>(10);
  const [total, setTotal] = useState(0);
  const [totalStudentsInView, setTotalStudentsInView] = useState(0);
  const [unassociatedStudentCount, setUnassociatedStudentCount] = useState(0);
  const [sortBy, setSortBy] = useState('cityid');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    // Sync filterStateId with URL param on mount and when URL changes
    const stateParam = searchParams.get('state');
    if (stateParam !== filterStateId) {
      setFilterStateId(stateParam || '');
      setPage(1);
    }
    // eslint-disable-next-line
  }, [searchParams]);

  useEffect(() => {
    setPage(1); // Reset to first page on search or filter
  }, [searchTerm, filterStateId]);

  useEffect(() => {
    loadData();
  }, [page, pageSize, searchTerm, filterStateId, sortBy, sortOrder]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: pageSize, search: searchTerm, sortBy, sortOrder };
      if (filterStateId) {
        params.stateid = filterStateId;
      }

      const [cityRes, stateRes, unassociatedRes] = await Promise.all([
        cityService.getAllCitiessum(params),
        stateService.getAllStates(),
        cityService.getUnassociatedCityStudentCount()
      ]);
      setCities(cityRes.data || []);
      setTotal(cityRes.total || 0);
      setTotalStudentsInView(cityRes.totalStudentsInView || 0);
      setStates(stateRes.data || []);
      setUnassociatedStudentCount(unassociatedRes.data.count || 0);
    } catch (error) {
      console.error('Error loading data:', error);
      setCities([]);
      setStates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (city: City | null = null) => {
    setCurrentCity(city);
    if (city) {
      setFormData({
        stateid: city.stateid.toString(),
        city: city.city,
        status: city.status,
        archive: city.archive,
        fyid: city.fyid?.toString() || '',
        target: city.target?.toString() || '',
        ATMDCode: city.ATMDCode || ''
      });
    } else {
      setFormData({
        stateid: '',
        city: '',
        status: true,
        archive: false,
        fyid: '',
        target: '',
        ATMDCode: ''
      });
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentCity(null);
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
        stateid: parseInt(formData.stateid),
        fyid: formData.fyid ? parseInt(formData.fyid) : undefined,
        target: formData.target ? parseInt(formData.target) : undefined
      };
      if (currentCity) {
        await cityService.updateCity(currentCity.cityid, submitData);
      } else {
        await cityService.createCity(submitData);
      }
      loadData();
      handleClose();
    } catch (error) {
      console.error('Error saving city:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      try {
        await cityService.deleteCity(id);
        loadData();
      } catch (error) {
        console.error('Error deleting city:', error);
      }
    }
  };

  const getStateName = (stateid: number) => {
    const state = states.find(s => s.stateid === stateid);
    return state ? state.state : 'Unknown';
  };

  const hasRelatedData = (city: City) => {
    const hasBranches = parseInt(city.TotalBranches || '0') > 0;
    const hasStudents = parseInt(city.TotalStudents || '0') > 0;
    
    return hasBranches || hasStudents;
  };

  const getDeleteDisabledReason = (city: City) => {
    const reasons = [];
    if (parseInt(city.TotalBranches || '0') > 0) reasons.push('branches');
    if (parseInt(city.TotalStudents || '0') > 0) reasons.push('students');
    
    return reasons.length > 0 ? `Cannot delete - has linked ${reasons.join(', ')}` : 'Delete';
  };

  const getStateFilterChange = (stateId: string) => {
    setFilterStateId(stateId);
    setPage(1);
    if (stateId) {
      setSearchParams({ state: stateId });
    } else {
      setSearchParams({});
    }
  };

  const clearStateFilter = () => {
    setFilterStateId('');
    setSearchParams({});
  };

  const handleCityClick = (cityId: number) => {
    navigate(`/master/locality?city=${cityId}`);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
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
            <h1 className="text-2xl font-bold text-gray-900">Cities</h1>
            <p className="text-gray-600 mt-1">
              {filterStateId 
                ? `Showing cities for ${getStateName(parseInt(filterStateId))}`
                : 'Manage city master data'
              }
            </p>
          </div>
          <button
            onClick={() => handleOpen()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus size={20} />
            <span>Add City</span>
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
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStateId}
              onChange={(e) => getStateFilterChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state.stateid} value={state.stateid}>
                  {state.state}
                </option>
              ))}
            </select>
            {filterStateId && (
              <button
                onClick={clearStateFilter}
                className="px-3 py-2 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                title="Clear state filter"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading cities...</p>
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
              <span className="ml-auto text-sm text-gray-600">Total Cities: <span className="font-semibold">{total}</span></span>
              <span className="ml-4 text-sm text-gray-600">Students in View: <span className="font-semibold">{totalStudentsInView}</span></span>
              <span className="ml-4 text-sm text-red-600">Unassociated: <span className="font-semibold">{unassociatedStudentCount}</span></span>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort('cityid')} className="flex items-center">
                      ID {sortBy === 'cityid' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     <button onClick={() => handleSort('city')} className="flex items-center">
                      City {sortBy === 'city' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
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
                     <button onClick={() => handleSort('stateid')} className="flex items-center">
                      State {sortBy === 'stateid' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ATMDCode</th>
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
                {cities.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No cities found
                    </td>
                  </tr>
                ) : (
                  cities.map((city) => {
                    const disabled = hasRelatedData(city);
                    return (
                      <tr key={city.cityid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{city.cityid}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <button
                            onClick={() => handleCityClick(city.cityid)}
                            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                          >
                            {city.city}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{city.TotalBranches}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{city.TotalStudents}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getStateName(city.stateid)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{city.ATMDCode || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${city.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {city.status ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${city.archive ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                            {city.archive ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpen(city)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => !disabled && handleDelete(city.cityid)}
                              disabled={disabled}
                              className={`p-1 rounded ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                              title={getDeleteDisabledReason(city)}
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
              {currentCity ? 'Edit City' : 'Add City'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City Name
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  name="stateid"
                  value={formData.stateid}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.stateid} value={state.stateid}>
                      {state.state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ATM Code
                </label>
                <input
                  type="text"
                  name="ATMDCode"
                  value={formData.ATMDCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    FY ID
                  </label>
                  <input
                    type="number"
                    name="fyid"
                    value={formData.fyid}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target
                  </label>
                  <input
                    type="number"
                    name="target"
                    value={formData.target}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
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

export default CitiesPage;