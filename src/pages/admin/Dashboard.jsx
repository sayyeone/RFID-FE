import { useState, useEffect } from 'react';
import { LayoutDashboard, DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';
import { useAuth } from '../../hooks/useAuth';
import StatsCard from '../../components/admin/StatsCard';
import RevenueChart from '../../components/admin/RevenueChart';
import PopularPlatesChart from '../../components/admin/PopularPlatesChart';
import RecentTransactions from '../../components/admin/RecentTransactions';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    revenue: 0,
    transactions: 0,
    plates: 0,
    users: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [popularPlates, setPopularPlates] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch initial data (default 7 days for revenue)
      const [statsRes, revenueRes, platesRes, transactionsRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRevenue(7),
        dashboardApi.getPopularPlates(5),
        dashboardApi.getRecentTransactions(5)
      ]);

      setStats(statsRes.data.data);
      setRevenueData(revenueRes.data.data);
      setPopularPlates(platesRes.data.data);
      setRecentTransactions(transactionsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = async (days) => {
    try {
      const response = await dashboardApi.getRevenue(days);
      setRevenueData(response.data.data);
    } catch (err) {
      console.error('Failed to fetch revenue data:', err);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <LayoutDashboard size={28} className="text-primary hidden sm:block" />
        <LayoutDashboard size={24} className="text-primary sm:hidden" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-xs sm:text-sm">Selamat datang, <span className="font-semibold text-primary">{user?.name || 'Admin'}</span>! 👋</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <StatsCard
          title="Total Revenue"
          value={`Rp ${stats.revenue.toLocaleString('id-ID')}`}
          icon={DollarSign}
          color="green"
          trend={{ percentage: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Transactions"
          value={stats.transactions}
          icon={ShoppingCart}
          color="blue"
          trend={{ percentage: 8.2, isPositive: true }}
        />
        <StatsCard
          title="Active Plates"
          value={stats.plates}
          icon={Package}
          color="purple"
        />
        <StatsCard
          title="Total Users"
          value={stats.users}
          icon={Users}
          color="orange"
        />
      </div>

      {/* Charts Row - Stack on mobile, side-by-side on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 sm:mb-6 px-1 sm:px-0">
        <div className="min-h-[350px]">
          <RevenueChart
            data={revenueData}
            loading={loading}
            onPeriodChange={handlePeriodChange}
          />
        </div>
        <div className="min-h-[350px]">
          <PopularPlatesChart data={popularPlates} loading={loading} />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={recentTransactions} loading={loading} />
    </div>
  );
}
