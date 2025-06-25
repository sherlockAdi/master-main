import React, { useState } from 'react';
import { Home, Globe, Map, Building2, Users, Briefcase, School, Landmark, BookOpen, Folder, Layers, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen = true, activeSection = '', onSectionChange = () => {} }) => {
  const location = useLocation();
  const [openMaster, setOpenMaster] = useState(true);
  const [openAddress, setOpenAddress] = useState(false);
  const [openCourses, setOpenCourses] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  return (
    <aside className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-6 py-5 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-2xl text-blue-600">E</div>
          <div>
            <h1 className="text-lg font-bold text-white">Employee Portal</h1>
            <p className="text-xs text-blue-100">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${location.pathname === '/' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => onSectionChange('home')}
              >
                <div className="flex items-center space-x-3">
                  <Home className={`w-5 h-5 ${location.pathname === '/' ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-medium">Home</span>
                </div>
                {location.pathname === '/' && <ChevronRight className="w-4 h-4" />}
              </Link>
            </li>
            <li>
              <button
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${openMaster ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setOpenMaster((v) => !v)}
              >
                <div className="flex items-center space-x-3">
                  <Folder className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Master</span>
                </div>
                {openMaster ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openMaster && (
                <ul className="ml-8 mt-2 space-y-1">
                  {/* Address Section */}
                  <li>
                    <button
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${openAddress ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => setOpenAddress((v) => !v)}
                    >
                      <div className="flex items-center space-x-2">
                        <Folder className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Address</span>
                      </div>
                      {openAddress ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {openAddress && (
                      <ul className="ml-8 mt-2 space-y-1">
                        <li>
                          <Link to="/master/master/address/country" className={`flex items-center p-2 rounded-lg transition-all duration-200 ${location.pathname === '/master/master/address/country' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}> <Globe className="w-4 h-4 mr-2" /> Country </Link>
                        </li>
                        <li>
                          <Link to="/master/master/address/state" className={`flex items-center p-2 rounded-lg transition-all duration-200 ${location.pathname === '/master/master/address/state' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}> <Map className="w-4 h-4 mr-2" /> State </Link>
                        </li>
                        <li>
                          <Link to="/master/master/address/city" className={`flex items-center p-2 rounded-lg transition-all duration-200 ${location.pathname === '/master/master/address/city' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}> <Building2 className="w-4 h-4 mr-2" /> City </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                  {/* Courses Section */}
                  <li>
                    <button
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${openCourses ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => setOpenCourses((v) => !v)}
                    >
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Courses</span>
                      </div>
                      {openCourses ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {openCourses && (
                      <ul className="ml-8 mt-2 space-y-1">
                        <li>
                          <Link to="/master/master/courses/list" className={`flex items-center p-2 rounded-lg transition-all duration-200 ${location.pathname === '/master/master/courses/list' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}> <BookOpen className="w-4 h-4 mr-2" /> All Courses </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                  {/* Category Section */}
                  <li>
                    <button
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${openCategory ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => setOpenCategory((v) => !v)}
                    >
                      <div className="flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Category</span>
                      </div>
                      {openCategory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {openCategory && (
                      <ul className="ml-8 mt-2 space-y-1">
                        <li>
                          <Link to="/master/master/category/list" className={`flex items-center p-2 rounded-lg transition-all duration-200 ${location.pathname === '/master/master/category/list' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}> <Layers className="w-4 h-4 mr-2" /> All Categories </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                  {/* Other Master Links */}
                  <li>
                    <Link to="/master/master/department" className={`flex items-center p-2 rounded-lg transition-all duration-200 ${location.pathname === '/master/master/department' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}> <Users className="w-4 h-4 mr-2" /> Department </Link>
                  </li>
                  <li>
                    <Link to="/master/master/designation" className={`flex items-center p-2 rounded-lg transition-all duration-200 ${location.pathname === '/master/master/designation' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}> <Briefcase className="w-4 h-4 mr-2" /> Designation </Link>
                  </li>
                  <li>
                    <Link to="/master/master/college" className={`flex items-center p-2 rounded-lg transition-all duration-200 ${location.pathname === '/master/master/college' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}> <School className="w-4 h-4 mr-2" /> College </Link>
                  </li>
                  <li>
                    <Link to="/master/master/branch" className={`flex items-center p-2 rounded-lg transition-all duration-200 ${location.pathname === '/master/master/branch' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}> <Landmark className="w-4 h-4 mr-2" /> Branch </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-100 mt-auto">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">Welcome!</p>
            <p className="text-xs text-gray-500">Manage your employee master data efficiently.</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 