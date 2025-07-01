import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const EmployeePortal: React.FC = () => {
  return (
    <div className="space-y-6">
     
      <Outlet />
    </div>
  );
};

export default EmployeePortal; 