import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import stateService from '../../services/stateService';
import countryService from '../../services/countryService';
import cityService from '../../services/cityService'; // New import
import { HiOutlineGlobe, HiOutlineUserGroup, HiOutlineLibrary, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineArchive } from 'react-icons/hi';

interface State {
  stateid: number;
  state: string;
  conid: number;
  status: boolean;
  archive: boolean;
  TotalBranches: string;
  TotalStudents: string;

}

interface Country {
  conid: number;
  country: string;
}

interface City {
  cityid: number;
  stateid: number;
}

const StatesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [states, setStates] = useState<State[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]); // New state
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentState, setCurrentState] = useState<State | null>(null);
  const [formData, setFormData] = useState({ conid: '', state: '', status: true, archive: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountryId, setFilterCountryId] = useState(() => searchParams.get('country') || '');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'all'>(10);
  const [total, setTotal] = useState(0);
  const [totalStudentsInView, setTotalStudentsInView] = useState(0);
  const [unassociatedStudentCount, setUnassociatedStudentCount] = useState(0);
  const [sortBy, setSortBy] = useState('stateid');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    // Sync filterCountryId with URL param on mount and when URL changes
    const countryParam = searchParams.get('country');
    if (countryParam !== filterCountryId) {
      setFilterCountryId(countryParam || '');
      setPage(1);
    }
    // eslint-disable-next-line
  }, [searchParams]);

  useEffect(() => {
    setPage(1); // Reset to first page on search or filter
  }, [searchTerm, filterCountryId]);

  useEffect(() => {
    loadData();
    loadUnassociatedStudentCount();
  }, [page, pageSize, searchTerm, filterCountryId, sortBy, sortOrder]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: pageSize, search: searchTerm, sortBy, sortOrder };
      if (filterCountryId) {
        params.conid = filterCountryId;
      }

      const [stateRes, countryRes, cityRes] = await Promise.all([
        stateService.getAllStatessuma(params),
        countryService.getAllCountries(),
        cityService.getAllCities()
      ]);
      setStates(stateRes.data || []);
      setTotal(stateRes.total || 0);
      setTotalStudentsInView(stateRes.totalStudentsInView || 0);
      setCountries(countryRes.data || []);
      setCities(cityRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setStates([]);
      setCountries([]);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUnassociatedStudentCount = async () => {
    try {
      const res = await stateService.getUnassociatedStateStudentCount();
      setUnassociatedStudentCount(res.data.count);
    } catch (error) {
      console.error("Failed to load unassociated student count:", error);
    }
  };

  const handleOpen = (state: State | null = null) => {
    setCurrentState(state);
    if (state) {
      setFormData({ conid: state.conid.toString(), state: state.state, status: state.status, archive: state.archive });
    } else {
      setFormData({ conid: '', state: '', status: true, archive: false });
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentState(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = { ...formData, conid: parseInt(formData.conid) };
      if (currentState) {
        await stateService.updateState(currentState.stateid, submitData);
      } else {
        await stateService.createState(submitData);
      }
      loadData();
      handleClose();
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this state?')) {
      try {
        await stateService.deleteState(id);
        loadData();
      } catch (error) {
        console.error('Error deleting state:', error);
      }
    }
  };

  const getCountryName = (conid: number) => {
    const country = countries.find(c => c.conid === conid);
    return country ? country.country : 'Unknown';
  };

  const hasCities = (stateid: number) => {
    return cities.some(city => city.stateid === stateid);
  };

  const hasRelatedData = (state: State) => {
    const hasCitiesData = hasCities(state.stateid);
    const hasBranches = parseInt(state.TotalBranches || '0') > 0;
    const hasStudents = parseInt(state.TotalStudents || '0') > 0;
    
    return hasCitiesData || hasBranches || hasStudents;
  };

  const getDeleteDisabledReason = (state: State) => {
    const reasons = [];
    if (hasCities(state.stateid)) reasons.push('cities');
    if (parseInt(state.TotalBranches || '0') > 0) reasons.push('branches');
    if (parseInt(state.TotalStudents || '0') > 0) reasons.push('students');
    
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

  const handleCountryFilterChange = (countryId: string) => {
    setFilterCountryId(countryId);
    setPage(1);
    if (countryId) {
      setSearchParams({ country: countryId });
    } else {
      setSearchParams({});
    }
  };

  const clearCountryFilter = () => {
    setFilterCountryId('');
    setSearchParams({});
  };

  const handleStateClick = (stateId: number) => {
    navigate(`/master/cities?state=${stateId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">States</h1>
            <p className="text-gray-600 mt-1">
              {filterCountryId 
                ? `Showing states for ${getCountryName(parseInt(filterCountryId))}`
                : 'Manage state master data'
              }
            </p>
          </div>
          <button
            onClick={() => handleOpen()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus size={20} />
            <span>Add State</span>
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
              placeholder="Search states..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCountryId}
              onChange={(e) => handleCountryFilterChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country.conid} value={country.conid}>
                  {country.country}
                </option>
              ))}
            </select>
            {filterCountryId && (
              <button
                onClick={clearCountryFilter}
                className="px-3 py-2 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                title="Clear country filter"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
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
        <span className="ml-auto text-sm text-gray-600">Total States: <span className="font-semibold">{total}</span></span>
        <span className="ml-4 text-sm text-gray-600">Students in View: <span className="font-semibold">{totalStudentsInView}</span></span>
        <span className="ml-4 text-sm text-red-600">Unassociated: <span className="font-semibold">{unassociatedStudentCount}</span></span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading states...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-blue-100 shadow-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider rounded-tl-2xl">
                    <button onClick={() => handleSort('stateid')} className="flex items-center gap-1 focus:outline-none">
                      <HiOutlineGlobe className="inline mr-1" />ID {sortBy === 'stateid' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <button onClick={() => handleSort('state')} className="flex items-center gap-1 focus:outline-none">
                      State {sortBy === 'state' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <button onClick={() => handleSort('TotalBranches')} className="flex items-center gap-1 focus:outline-none">
                      <HiOutlineLibrary className="inline mr-1" />Branch Count {sortBy === 'TotalBranches' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <button onClick={() => handleSort('TotalStudents')} className="flex items-center gap-1 focus:outline-none">
                      <HiOutlineUserGroup className="inline mr-1" />Student Count {sortBy === 'TotalStudents' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <button onClick={() => handleSort('conid')} className="flex items-center gap-1 focus:outline-none">
                      <HiOutlineGlobe className="inline mr-1" />Country {sortBy === 'conid' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
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
                {states.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No states found
                    </td>
                  </tr>
                ) : (
                  states.map((state) => {
                    const disabled = hasRelatedData(state);
                    return (
                      <tr key={state.stateid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{state.stateid}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <button
                            onClick={() => handleStateClick(state.stateid)}
                            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                          >
                            {state.state}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{state.TotalBranches}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{state.TotalStudents}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getCountryName(state.conid)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${state.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {state.status ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${state.archive ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                            {state.archive ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpen(state)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => !disabled && handleDelete(state.stateid)}
                              disabled={disabled}
                              className={`p-1 rounded ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                              title={getDeleteDisabledReason(state)}
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
              {currentState ? 'Edit State' : 'Add State'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State Name</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  name="conid"
                  value={formData.conid}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.conid} value={country.conid}>
                      {country.country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} className="mr-2" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="archive" checked={formData.archive} onChange={handleChange} className="mr-2" />
                  <span className="text-sm text-gray-700">Archive</span>
                </label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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

export default StatesPage;
