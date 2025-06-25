import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CountriesPage from './pages/CountriesPage';
import StatesPage from './pages/StatesPage';
import DepartmentsPage from './pages/DepartmentsPage';
import DesignationsPage from './pages/DesignationsPage';
import DistrictsPage from './pages/DistrictsPage';
import TehsilsPage from './pages/TehsilsPage';
// Import other pages when they are created
// import StatesPage from './pages/StatesPage';
// etc.

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/countries" element={<CountriesPage />} />
          <Route path="/states" element={<StatesPage />} />
          <Route path="/districts" element={<DistrictsPage />} />
          <Route path="/tehsils" element={<TehsilsPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/designations" element={<DesignationsPage />} />
          {/* <Route path="/states" element={<StatesPage />} /> */}
          {/* Add other routes here */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
