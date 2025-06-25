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
  const location = useLocation();

  const masterMenuItems = [
    { name: 'Countries', path: '/master/countries', icon: Globe },
    { name: 'States', path: '/master/states', icon: MapPin },
    { name: 'Cities', path: '/master/cities', icon: Building2 },
    { name: 'Departments', path: '/master/departments', icon: Briefcase },
    { name: 'Designations', path: '/master/designations', icon: Users },
    { name: 'Colleges', path: '/master/colleges', icon: GraduationCap },
    { name: 'Branches', path: '/master/branches', icon: Building2 },
  ];

  const isActivePath = (path: string) => location.pathname === path;
  const isMasterActive = masterMenuItems.some(item => location.pathname === item.path);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">Employee Portal</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-6 px-4">
          <Link 
            to="/" 
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-2 transition-colors ${isActivePath('/') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <Home className="mr-3" size={20} />
            Dashboard
          </Link>

          {/* Master Menu */}
          <div className="mb-2">
            <button
              onClick={() => setMasterMenuOpen(!masterMenuOpen)}
              className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isMasterActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}`}
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
                    className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${isActivePath(item.path) ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}
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
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Welcome to Employee Portal
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;