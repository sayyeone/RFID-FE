import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

// Admin Pages (akan dibuat)
import AdminDashboard from '../pages/admin/Dashboard';
import PlateManagement from '../pages/admin/PlateManagement';

// Kasir Pages (akan dibuat)
import KasirPOS from '../pages/kasir/POS';
import KasirHistory from '../pages/kasir/History';

export default function AppRouter() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<PrivateRoute />}>
                <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={
                    <RoleRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                    </RoleRoute>
                } />
                <Route path="plates" element={
                    <RoleRoute allowedRoles={['admin']}>
                        <PlateManagement />
                    </RoleRoute>
                } />
            </Route>

            {/* Kasir Routes */}
            <Route path="/kasir" element={<PrivateRoute />}>
                <Route path="" element={<Navigate to="/kasir/pos" replace />} />
                <Route path="pos" element={
                    <RoleRoute allowedRoles={['kasir']}>
                        <KasirPOS />
                    </RoleRoute>
                } />
                <Route path="history" element={
                    <RoleRoute allowedRoles={['kasir']}>
                        <KasirHistory />
                    </RoleRoute>
                } />
            </Route>

            {/* Default */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
