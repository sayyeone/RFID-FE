import api from './axiosConfig';

export const dashboardApi = {
  // Get dashboard stats
  getStats: () => {
    return api.get('/dashboard/stats');
  },

  // Get revenue data for chart (7 or 30 days)
  getRevenue: (days = 7) => {
    return api.get(`/dashboard/revenue?days=${days}`);
  },

  // Get popular plates
  getPopularPlates: (limit = 5) => {
    return api.get(`/dashboard/popular-plates?limit=${limit}`);
  },

  // Get recent transactions
  getRecentTransactions: (limit = 10) => {
    return api.get(`/dashboard/recent-transactions?limit=${limit}`);
  }
};
