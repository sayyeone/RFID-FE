import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, History, LogOut, Menu, X, LayoutDashboard, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function KasirLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);

    // Auto-open sidebar on desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };

    const menuItems = [
        { path: '/kasir/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/kasir/pos', icon: ShoppingCart, label: 'Point of Sale' },
        { path: '/kasir/history', icon: History, label: 'Transaction History' }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="h-screen flex overflow-hidden bg-gray-50">
            {/* Fixed Sidebar */}
            <aside
                className={`
                    fixed left-0 top-0 h-screen
                    bg-white border-r border-gray-200
                    transition-all duration-300 z-40
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
                style={{
                    width: '280px',
                }}
            >
                <div className="h-full flex flex-col py-4">
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center justify-between px-6 mb-2 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <ShoppingCart className="text-white" size={20} />
                            </div>
                            {sidebarOpen && (
                                <h1 className="text-lg font-bold text-gray-800 tracking-tight whitespace-nowrap">KASIR RFID</h1>
                            )}
                        </div>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                        >
                            <X size={20} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-4 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => {
                                    if (window.innerWidth < 768) {
                                        setSidebarOpen(false);
                                    }
                                }}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${isActive(item.path)
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'text-gray-600 hover:bg-gray-100 hover:translate-x-1'
                                    }`}
                            >
                                <item.icon size={20} className={`shrink-0 transition-colors ${isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-primary'}`} />
                                {sidebarOpen && <span className="font-semibold tracking-wide">{item.label}</span>}
                            </Link>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar"
                />
            )}

            {/* Main Content Wrapper */}
            <div
                className="flex-1 flex flex-col transition-all duration-300 min-w-0"
                style={{
                    marginLeft: '0',
                }}
            >
                {/* Floating Navbar */}
                <div className="px-4 pt-4 md:px-8 md:pt-4 sticky top-0 z-20">
                    <header className="h-16 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg shadow-gray-200/50 flex items-center justify-between px-4 md:px-6">
                        {/* Left: Sidebar toggle button */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                        >
                            <Menu size={20} />
                        </button>

                        {/* Right: User Profile Dropdown */}
                        <div className="ml-auto flex items-center gap-2">
                            <div className="hidden lg:flex items-center gap-1 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600">
                                <span>Star</span>
                                <span className="px-1.5 bg-white rounded border border-gray-200">99+</span>
                            </div>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className="flex items-center gap-3 p-1 hover:bg-gray-100 rounded-2xl transition-all group"
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center font-bold shadow-md border-2 border-white overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                            {user?.name?.charAt(0).toUpperCase() || 'K'}
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors">{user?.name || 'Kasir'}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold leading-tight">{user?.role || 'kasir'}</p>
                                    </div>
                                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 overflow-hidden">
                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center font-semibold text-lg shadow-md">
                                                    {user?.name?.charAt(0).toUpperCase() || 'K'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'Kasir'}</p>
                                                    <p className="text-xs text-gray-500 capitalize truncate">{user?.role || 'kasir'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2">
                                            <button
                                                onClick={() => {
                                                    setProfileDropdownOpen(false);
                                                    navigate('/kasir/profile');
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                                            >
                                                <User size={18} className="text-gray-500" />
                                                <span className="font-medium">My Profile</span>
                                            </button>
                                        </div>

                                        {/* Logout */}
                                        <div className="border-t border-gray-100 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                                            >
                                                <LogOut size={18} />
                                                <span>Log Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
