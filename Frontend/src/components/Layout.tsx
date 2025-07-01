import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Globe,
  MapPin,
  Building2,
  Briefcase,
  Users,
  GraduationCap,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [masterMenuOpen, setMasterMenuOpen] = useState(true);
  const [employeeMenuOpen, setEmployeeMenuOpen] = useState(true);
  const location = useLocation();

  const masterMenuItems = [
    { name: 'Countries', path: '/master/countries', icon: Globe },
    { name: 'States', path: '/master/states', icon: MapPin },
    { name: 'Cities', path: '/master/cities', icon: Building2 },
    { name: 'Locality', path: '/master/locality', icon: Building2 },
    { name: 'Departments', path: '/master/departments', icon: Briefcase },
    { name: 'Designations', path: '/master/designations', icon: Users },
    { name: 'Colleges', path: '/master/colleges', icon: GraduationCap },
    { name: 'Branches', path: '/master/branches', icon: Building2 },
    { name: 'Employees', path: '/master/employees', icon: Users },
  ];

  const employeeMenuItems = [
    { name: 'Employee Card', path: '/employee-portal/card', icon: Users },
    { name: 'Employee List', path: '/employee-portal/list', icon: Briefcase },
  ];

  const isActivePath = (path: string) => location.pathname === path;
  const isMasterActive = masterMenuItems.some(item => location.pathname === item.path);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen z-50 w-64 bg-white/80 backdrop-blur-lg shadow-2xl border-r border-blue-100 text-slate-900 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col`}>
        {/* Logo/Avatar */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-blue-100 bg-white/60 backdrop-blur-lg sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <img src="/logo192.png" alt="Logo" className="w-8 h-8 rounded-full shadow" />
            <h1 className="text-xl font-bold tracking-tight">Employee Portal</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-700 hover:text-blue-600"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="mt-6 px-4 flex-1 overflow-y-auto pb-8">
          <Link
            to="/"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-2 transition-colors ${isActivePath('/') ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-blue-100 hover:text-blue-700'}`}
          >
            <Home className="mr-3" size={20} />
            Dashboard
          </Link>
          {/* Employee Portal Dropdown */}
          <div className="mb-2">
            <button
              onClick={() => setEmployeeMenuOpen(!employeeMenuOpen)}
              className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname.startsWith('/employee-portal') ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-blue-100 hover:text-blue-700'}`}
            >
              <span className="flex items-center">
                <Users className="mr-3" size={20} />
                Employee Portal
              </span>
              <ChevronDown
                className={`transform transition-transform ${employeeMenuOpen ? 'rotate-180' : ''}`}
                size={16}
              />
            </button>
            {employeeMenuOpen && (
              <div className="ml-6 mt-2 space-y-1">
                {employeeMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${isActivePath(item.path) ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-blue-100 hover:text-blue-700'}`}
                  >
                    <item.icon className="mr-3" size={16} />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/* Master Menu */}
          <div className="mb-2">
            <button
              onClick={() => setMasterMenuOpen(!masterMenuOpen)}
              className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isMasterActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-blue-100 hover:text-blue-700'}`}
            >
              <span className="flex items-center">
                <Building2 className="mr-3" size={20} />
                Master Data
              </span>
              <ChevronDown
                className={`transform transition-transform ${masterMenuOpen ? 'rotate-180' : ''}`}
                size={16}
              />
            </button>
            {masterMenuOpen && (
              <div className="ml-6 mt-2 space-y-1">
                {masterMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${isActivePath(item.path) ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-blue-100 hover:text-blue-700'}`}
                  >
                    <item.icon className="mr-3" size={16} />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg shadow-md border-b border-blue-100 h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-blue-600 hover:text-blue-900"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <img src="/logo192.png" alt="Logo" className="w-8 h-8 rounded-full shadow" />
            <div className="text-lg font-semibold text-blue-700 tracking-tight">Welcome to Employee Portal</div>
          </div>
        </header>
        {/* Page Content */}
        <main className="p-2 pt-4 ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;