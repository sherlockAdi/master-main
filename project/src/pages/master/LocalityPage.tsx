import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import localityService from '../../services/localityService';
import cityService from '../../services/cityService';

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
    const [filterCityId, setFilterCityId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [tehsilRes, cityRes] = await Promise.all([
                localityService.getAllLocalitiesSum(),
                cityService.getAllCities()
            ]);
            setLocalities(tehsilRes.data || []);
            setCities(cityRes.data || []);
        } catch (err) {
            console.error(err);
            setError('Failed to load data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        // Check if there's a city parameter in the URL
        const cityParam = searchParams.get('city');
        if (cityParam) {
            setFilterCityId(cityParam);
        }
    }, [searchParams]);

    const getCityName = (cityid: number) => {
        const city = cities.find(c => c.cityid === cityid);
        return city ? city.city : 'Unknown';
    };

    const filteredLocalities = localities.filter(loc => {
        const matchesSearch = loc.Tehsil_names.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = filterCityId === '' || loc.atmcityid === parseInt(filterCityId);
        return matchesSearch && matchesCity;
    });

    const handleCityFilterChange = (cityId: string) => {
        setFilterCityId(cityId);
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

            <div className="bg-white shadow rounded overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-600">Loading...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-600">{error}</div>
                ) : filteredLocalities.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No localities found</div>
                ) : (
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">ID</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Locality</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">City</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Students</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredLocalities.map(loc => (
                                <tr key={loc.tehsil_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{loc.tehsil_id}</td>
                                    <td className="px-6 py-4">{loc.Tehsil_names}</td>
                                    <td className="px-6 py-4">{getCityName(loc.atmcityid)}</td>
                                    <td className="px-6 py-4">{loc.TotalStudents}</td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button title="Edit"><Edit className="text-blue-600" size={16} /></button>
                                        <button title="Delete"><Trash2 className="text-red-600" size={16} /></button>
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
