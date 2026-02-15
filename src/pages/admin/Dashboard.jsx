import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';
import { useAuth } from '../../hooks/useAuth';
import ContextualGreeting from '../../components/admin/ContextualGreeting';
import StatsCard from '../../components/admin/StatsCard';
import RevenueChart from '../../components/admin/RevenueChart';
import PopularPlatesList from '../../components/admin/PopularPlatesList';
import RecentTransactions from '../../components/admin/RecentTransactions';
import ActivityFeed from '../../components/admin/ActivityFeed';

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
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch initial data (default 7 days for revenue)
      const [statsRes, revenueRes, platesRes, transactionsRes, activitiesRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRevenue(7),
        dashboardApi.getPopularPlates(5),
        dashboardApi.getRecentTransactions(5),
        dashboardApi.getActivities(5)
      ]);

      setStats(statsRes.data.data);
      setRevenueData(revenueRes.data.data);
      setPopularPlates(platesRes.data.data);
      setRecentTransactions(transactionsRes.data.data);
      setActivities(activitiesRes.data.data);
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
      {/* Contextual Greeting */}
      <ContextualGreeting userName={user?.name} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <StatsCard
          title="Total Revenue"
          value={`Rp ${stats.revenue.toLocaleString('id-ID')}`}
          icon={DollarSign}
          color="green"
          trend={{ percentage: 12.5, isPositive: true }}
          navigateTo="/admin/transactions"
          sparklineData={[
            { value: 4000 }, { value: 3000 }, { value: 5000 }, { value: 4500 }, { value: 6000 }, { value: 5500 }, { value: 7000 }
          ]}
        />
        <StatsCard
          title="Transactions"
          value={stats.transactions}
          icon={ShoppingCart}
          color="blue"
          trend={{ percentage: 8.2, isPositive: true }}
          navigateTo="/admin/transactions"
          sparklineData={[
            { value: 20 }, { value: 35 }, { value: 25 }, { value: 45 }, { value: 30 }, { value: 50 }, { value: 40 }
          ]}
        />
        <StatsCard
          title="Active Plates"
          value={stats.plates}
          icon={Package}
          color="purple"
          navigateTo="/admin/plates"
          sparklineData={[
            { value: 10 }, { value: 12 }, { value: 10 }, { value: 15 }, { value: 14 }, { value: 18 }, { value: 20 }
          ]}
        />
        <StatsCard
          title="Total Users"
          value={stats.users}
          icon={Users}
          color="orange"
          navigateTo="/admin/users"
          sparklineData={[
            { value: 5 }, { value: 8 }, { value: 7 }, { value: 10 }, { value: 12 }, { value: 15 }, { value: 18 }
          ]}
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
          <PopularPlatesList data={popularPlates} loading={loading} />
        </div>
      </div>

      {/* Recent Transactions & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions transactions={recentTransactions} loading={loading} />
        </div>
        <div>
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
}
