import React from 'react';
import Sidebar from './Sidebar';
import '../main.css';

const Layout = ({ children }) => {
    return (
        <div className="layout-root">
            <header className="main-header">
                <div className="header-logo">M</div>
                <div className="header-title">Master CRUD Application</div>
            </header>
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout; 