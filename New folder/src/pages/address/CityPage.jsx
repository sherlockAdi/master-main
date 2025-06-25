import React, { useState, useEffect } from 'react';
import cityService from '../../services/cityService';

const CityPage = () => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    cityService.getAllCities().then(setCities);
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Cities</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cities.map((city) => (
              <tr key={city.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{city.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{city.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CityPage; 