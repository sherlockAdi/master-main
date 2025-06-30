import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import localityService from '../../services/localityService';
import cityService from '../../services/cityService';
import stateService from '../../services/stateService';

interface Locality {
    tehsil_id: number;
    tehsil_code: string;
    Tehsil_names: string;
    district_code: string;
    atmcityid: number;
    TotalStudents: number;
}

interface City {
    cityid: number;
    city: string;
}

const LocalitiesPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [localities, setLocalities] = useState<Locality[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCityId, setFilterCityId] = useState(() => searchParams.get('city') || '');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<number | 'all'>(10);
    const [total, setTotal] = useState(0);
    const [totalStudentsInView, setTotalStudentsInView] = useState(0);
    const [unassociatedStudents, setUnassociatedStudents] = useState(0);
    const [sortBy, setSortBy] = useState('tehsil_id');
    const [sortOrder, setSortOrder] = useState('asc');

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params: any = { page, limit: pageSize, search: searchTerm, sortBy, sortOrder };
            if (filterCityId) {
                params.atmcityid = filterCityId;
            }

            const [tehsilRes, cityRes, unassociatedRes] = await Promise.all([
                localityService.getAllLocalitiesSum(params),
                cityService.getAllCities(),
                stateService.getUnassociatedStudentCount()
            ]);
            setLocalities(tehsilRes.data || []);
            setTotal(tehsilRes.total || 0);
            setTotalStudentsInView(tehsilRes.totalStudentsInView || 0);
            setCities(cityRes.data || []);
            setUnassociatedStudents(unassociatedRes.data.count || 0);
        } catch (err) {
            console.error(err);
            setError('Failed to load data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Sync filterCityId with URL param on mount and when URL changes
        const cityParam = searchParams.get('city');
        if (cityParam !== filterCityId) {
            setFilterCityId(cityParam || '');
            setPage(1);
        }
        // eslint-disable-next-line
    }, [searchParams]);

    useEffect(() => {
        setPage(1); // Reset to first page on search or filter
    }, [searchTerm, filterCityId]);

    useEffect(() => {
        loadData();
    }, [page, pageSize, searchTerm, filterCityId, sortBy, sortOrder]);

    const getCityName = (cityid: number) => {
        const city = cities.find(c => c.cityid === cityid);
        return city ? city.city : 'Unknown';
    };

    const hasRelatedData = (locality: Locality) => {
        return locality.TotalStudents > 0;
    };

    const getDeleteDisabledReason = (locality: Locality) => {
        return locality.TotalStudents > 0 ? `Cannot delete - has ${locality.TotalStudents} students` : 'Delete';
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this locality?')) {
            try {
                await localityService.deleteLocality(id);
                loadData();
            } catch (error) {
                console.error('Error deleting locality:', error);
            }
        }
    };

    const handleCityFilterChange = (cityId: string) => {
        setFilterCityId(cityId);
        setPage(1);
        if (cityId) {
            setSearchParams({ city: cityId });
        } else {
            setSearchParams({});
        }
    };

    const clearCityFilter = () => {
        setFilterCityId('');
        setSearchParams({});
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
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded shadow">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Localities</h2>
                    <p className="text-gray-500">
                        {filterCityId 
                            ? `Showing localities for ${getCityName(parseInt(filterCityId))}`
                            : 'Showing tehsils as localities'
                        }
                    </p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
                    <Plus size={16} /> Add Locality
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-1/2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search locality..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border rounded"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-1/2">
                    <select
                        value={filterCityId}
                        onChange={(e) => handleCityFilterChange(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded"
                    >
                        <option value="">All Cities</option>
                        {cities.map(city => (
                            <option key={city.cityid} value={city.cityid}>{city.city}</option>
                        ))}
                    </select>
                    {filterCityId && (
                        <button
                            onClick={clearCityFilter}
                            className="px-3 py-2 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
                            title="Clear city filter"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

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
                <span className="ml-auto text-sm text-gray-600">Total Localities: <span className="font-semibold">{total}</span></span>
                <span className="ml-4 text-sm text-gray-600">Students in View: <span className="font-semibold">{totalStudentsInView}</span></span>
                <span className="ml-4 text-sm text-red-600">Unassociated: <span className="font-semibold">{unassociatedStudents}</span></span>
            </div>

            <div className="bg-white shadow rounded overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-600">Loading...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-600">{error}</div>
                ) : localities.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No localities found</div>
                ) : (
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">
                                     <button onClick={() => handleSort('tehsil_id')} className="flex items-center">
                                        ID {sortBy === 'tehsil_id' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                                    </button>
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">
                                     <button onClick={() => handleSort('Tehsil_names')} className="flex items-center">
                                        Locality {sortBy === 'Tehsil_names' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                                    </button>
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">
                                     <button onClick={() => handleSort('atmcityid')} className="flex items-center">
                                        City {sortBy === 'atmcityid' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                                    </button>
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">
                                    <button onClick={() => handleSort('TotalStudents')} className="flex items-center">
                                        Students {sortBy === 'TotalStudents' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                                    </button>
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {localities.map(loc => (
                                <tr key={loc.tehsil_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{loc.tehsil_id}</td>
                                    <td className="px-6 py-4">{loc.Tehsil_names}</td>
                                    <td className="px-6 py-4">{getCityName(loc.atmcityid)}</td>
                                    <td className="px-6 py-4">{loc.TotalStudents}</td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button title="Edit"><Edit className="text-blue-600" size={16} /></button>
                                        <button
                                            onClick={() => !hasRelatedData(loc) && handleDelete(loc.tehsil_id)}
                                            disabled={hasRelatedData(loc)}
                                            className={`p-1 rounded ${hasRelatedData(loc) ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                                            title={getDeleteDisabledReason(loc)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default LocalitiesPage;
