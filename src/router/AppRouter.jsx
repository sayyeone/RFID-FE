import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import KasirLayout from '../layouts/KasirLayout';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import PlateManagement from '../pages/admin/PlateManagement';

// Kasir Pages
import KasirDashboard from '../pages/kasir/Dashboard';
import KasirPOS from '../pages/kasir/POS';
import KasirHistory from '../pages/kasir/History';

export default function AppRouter() {
    return (
        <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<PrivateRoute />}>
                <Route element={<RoleRoute allowedRoles={['admin']}><AdminLayout /></RoleRoute>}>
                    <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="plates" element={<PlateManagement />} />
                </Route>
            </Route>

            {/* Kasir Routes */}
            <Route path="/kasir" element={<PrivateRoute />}>
                <Route element={<RoleRoute allowedRoles={['kasir']}><KasirLayout /></RoleRoute>}>
                    <Route path="" element={<Navigate to="/kasir/dashboard" replace />} />
                    <Route path="dashboard" element={<KasirDashboard />} />
                    <Route path="pos" element={<KasirPOS />} />
                    <Route path="history" element={<KasirHistory />} />
                </Route>
            </Route>

            {/* Default */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
