import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, CalendarRange, LogOut, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
    const { logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Transactions', path: '/transactions', icon: ReceiptText },
        { name: 'Monthly Plan', path: '/monthly-plan', icon: CalendarRange },
    ];

    return (
        <aside className="sidebar glass" style={{ width: '260px', height: '100vh', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, zIndex: 10 }}>
            <div className="logo flex items-center gap-2" style={{ marginBottom: '3rem' }}>
                <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                    <Wallet size={24} color="white" />
                </div>
                <span className="font-bold text-2xl" style={{ letterSpacing: '-0.02em' }}>MoneyMatters</span>
            </div>

            <nav style={{ flex: 1 }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `flex items-center gap-4 ${isActive ? 'active' : ''}`}
                                style={({ isActive }) => ({
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius)',
                                    transition: 'all 0.2s ease',
                                    background: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                    color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                                    fontWeight: isActive ? '600' : '400'
                                })}
                            >
                                <item.icon size={20} />
                                <span>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <button
                onClick={logout}
                className="flex items-center gap-4 text-muted"
                style={{ padding: '0.75rem 1rem', marginTop: 'auto', width: '100%', borderRadius: 'var(--radius)' }}
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;
