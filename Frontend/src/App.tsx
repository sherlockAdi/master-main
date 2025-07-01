import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CountriesPage from './pages/master/CountriesPage';
import StatesPage from './pages/master/StatesPage';
import CitiesPage from './pages/master/CitiesPage';
import DepartmentsPage from './pages/master/DepartmentsPage';
import DesignationsPage from './pages/master/DesignationsPage';
import CollegesPage from './pages/master/CollegesPage';
import BranchesPage from './pages/master/BranchesPage';
import LocalitiesPage from './pages/master/LocalityPage';
import EmployeesPage from './pages/master/EmployeesPage';
import EmployeePortal from './pages/EmployeePortal';
import EmployeeCard from './pages/employee/EmployeeCard';
import EmployeeList from './pages/employee/EmployeeList';
import EmployeeRegistration from './pages/employee/EmployeeRegistration';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/master/countries" element={<CountriesPage />} />
          <Route path='/master/locality' element={<LocalitiesPage />} />
          <Route path="/master/states" element={<StatesPage />} />
          <Route path="/master/cities" element={<CitiesPage />} />
          <Route path="/master/departments" element={<DepartmentsPage />} />
          <Route path="/master/designations" element={<DesignationsPage />} />
          <Route path="/master/colleges" element={<CollegesPage />} />
          <Route path="/master/branches" element={<BranchesPage />} />
          <Route path="/master/employees" element={<EmployeesPage />} />
          <Route path="/employee-portal" element={<EmployeePortal />}>
            <Route path="card" element={<EmployeeCard />} />
            <Route path="list" element={<EmployeeList />} />
          </Route>
          <Route path="/employee/registration" element={<EmployeeRegistration />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;