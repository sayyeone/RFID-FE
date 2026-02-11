import { useState, useEffect } from 'react';
import { LayoutDashboard, DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';
import StatsCard from '../../components/admin/StatsCard';
import RevenueChart from '../../components/admin/RevenueChart';
import PopularPlatesChart from '../../components/admin/PopularPlatesChart';
import RecentTransactions from '../../components/admin/RecentTransactions';

export default function AdminDashboard() {
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
      // Fetch all data in parallel
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

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <LayoutDashboard size={32} className="text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here's your overview</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RevenueChart data={revenueData} loading={loading} />
        <PopularPlatesChart data={popularPlates} loading={loading} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={recentTransactions} loading={loading} />
    </div>
  );
}
