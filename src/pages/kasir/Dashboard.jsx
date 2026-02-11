import { useState, useEffect } from 'react';
import { LayoutDashboard, DollarSign, ShoppingCart, CheckCircle, TrendingUp } from 'lucide-react';
import { transactionApi } from '../../api/transactionApi';
import { useAuth } from '../../hooks/useAuth';

export default function KasirDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        todayTotal: 0,
        todayCount: 0,
        weekTotal: 0,
        monthTotal: 0
    });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch recent transactions
            const response = await transactionApi.getHistory({ limit: 5 });
            const transactions = response.data.data || [];
            setRecentTransactions(transactions);

            // Calculate stats from transactions
            const now = new Date();
            const today = now.toDateString();
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

            const todayTxs = transactions.filter(t => new Date(t.created_at).toDateString() === today);
            const weekTxs = transactions.filter(t => new Date(t.created_at) >= weekAgo);
            const monthTxs = transactions.filter(t => new Date(t.created_at) >= monthAgo);

            setStats({
                todayTotal: todayTxs.reduce((sum, t) => sum + t.total_amount, 0),
                todayCount: todayTxs.length,
                weekTotal: weekTxs.reduce((sum, t) => sum + t.total_amount, 0),
                monthTotal: monthTxs.reduce((sum, t) => sum + t.total_amount, 0)
            });
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <LayoutDashboard size={32} className="text-primary" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-500 text-sm">Welcome back, {user?.name || 'Kasir'}!</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="card hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500 mb-1">Today's Revenue</p>
                            <p className="text-2xl font-bold text-gray-800">
                                Rp {stats.todayTotal.toLocaleString('id-ID')}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-green-100 text-green-600">
                            <DollarSign size={28} />
                        </div>
                    </div>
                </div>

                <div className="card hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500 mb-1">Today's Orders</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.todayCount}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-100 text-blue-600">
                            <ShoppingCart size={28} />
                        </div>
                    </div>
                </div>

                <div className="card hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500 mb-1">Weekly Revenue</p>
                            <p className="text-2xl font-bold text-gray-800">
                                Rp {stats.weekTotal.toLocaleString('id-ID')}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-100 text-purple-600">
                            <TrendingUp size={28} />
                        </div>
                    </div>
                </div>

                <div className="card hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500 mb-1">Monthly Revenue</p>
                            <p className="text-2xl font-bold text-gray-800">
                                Rp {stats.monthTotal.toLocaleString('id-ID')}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-orange-100 text-orange-600">
                            <CheckCircle size={28} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    </div>
                ) : recentTransactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        No transactions yet. Start scanning plates!
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentTransactions.map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">Order #{transaction.order_id}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(transaction.created_at).toLocaleString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-primary">
                                        Rp {transaction.total_amount.toLocaleString('id-ID')}
                                    </p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${transaction.status === 'paid'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {transaction.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
