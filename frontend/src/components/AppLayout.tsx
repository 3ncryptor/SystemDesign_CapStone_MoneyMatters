import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AppLayout: React.FC = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
            <Sidebar />
            <main style={{ flex: 1, marginLeft: '260px', padding: '2rem 3rem' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
