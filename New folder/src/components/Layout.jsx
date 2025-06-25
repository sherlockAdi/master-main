import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex h-screen">
                <Sidebar />
                <main className="flex-1 overflow-y-auto h-screen m-5">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout; 