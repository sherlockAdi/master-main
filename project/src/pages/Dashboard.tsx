import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Building2, MapPin, Globe, GraduationCap, TrendingUp } from 'lucide-react';
import countryService from '../services/countryService';
import stateService from '../services/stateService';
import cityService from '../services/cityService';
import departmentService from '../services/departmentService';
import designationService from '../services/designationService';
import collegeService from '../services/collegeService';
import branchService from '../services/branchService';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    countries: 0,
    states: 0,
    cities: 0,
    departments: 0,
    designations: 0,
    colleges: 0,
    branches: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [
        countriesRes,
        statesRes,
        citiesRes,
        departmentsRes,
        designationsRes,
        collegesRes,
        branchesRes,
      ] = await Promise.all([
        countryService.getAllCountries().catch(() => ({ data: [] })),
        stateService.getAllStates().catch(() => ({ data: [] })),
        cityService.getAllCities().catch(() => ({ data: [] })),
        departmentService.getAllDepartments().catch(() => ({ data: [] })),
        designationService.getAllDesignations().catch(() => ({ data: [] })),
        collegeService.getAllColleges().catch(() => ({ data: [] })),
        branchService.getAllBranches().catch(() => ({ data: [] })),
      ]);

      setStats({
        countries: countriesRes.data?.length || 0,
        states: statesRes.data?.length || 0,
        cities: citiesRes.data?.length || 0,
        departments: departmentsRes.data?.length || 0,
        designations: designationsRes.data?.length || 0,
        colleges: collegesRes.data?.length || 0,
        branches: branchesRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Countries',
      value: stats.countries,
      icon: Globe,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'States',
      value: stats.states,
      icon: MapPin,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Cities',
      value: stats.cities,
      icon: Building2,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Departments',
      value: stats.departments,
      icon: Users,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Designations',
      value: stats.designations,
      icon: BarChart3,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Colleges',
      value: stats.colleges,
      icon: GraduationCap,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Branches',
      value: stats.branches,
      icon: TrendingUp,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the Employee Portal Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : card.value}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <h3 className="font-medium text-gray-900">Manage Countries</h3>
            <p className="text-sm text-gray-600 mt-1">Add or edit country records</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <h3 className="font-medium text-gray-900">Manage Departments</h3>
            <p className="text-sm text-gray-600 mt-1">Configure department settings</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <h3 className="font-medium text-gray-900">Manage Colleges</h3>
            <p className="text-sm text-gray-600 mt-1">Update college information</p>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">API Status</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Connected to localhost:5000</span>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Last Updated</h3>
            <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;