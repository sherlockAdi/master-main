import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../main.css';

const menuItems = [
    { text: 'Home', icon: '🏠', path: '/' },
    { text: 'Countries', icon: '🌍', path: '/countries' },
    { text: 'States', icon: '🗺️', path: '/states' },
    { text: 'Districts', icon: '🏢', path: '/districts' },
    { text: 'Tehsils', icon: '🏞️', path: '/tehsils' },
    { text: 'Departments', icon: '🏛️', path: '/departments' },
    { text: 'Designations', icon: '👔', path: '/designations' },
];

const Sidebar = () => {
    const location = useLocation();
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-avatar">M</div>
                <div className="sidebar-title">Master CRUD</div>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        to={item.path}
                        key={item.text}
                        className={`sidebar-link${location.pathname === item.path ? ' active' : ''}`}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span>{item.text}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar; 