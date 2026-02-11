import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AdminHeader() {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">POS RFID System</h1>
                    <p className="text-sm text-gray-500">Admin Panel</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                        <User size={20} className="text-gray-600" />
                        <div>
                            <p className="text-sm font-medium text-gray-800">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role || 'Role'}</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
