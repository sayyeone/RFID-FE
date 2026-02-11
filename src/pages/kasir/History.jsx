import { useState, useEffect } from 'react';
import { History as HistoryIcon, Calendar, Filter } from 'lucide-react';
import { transactionApi } from '../../api/transactionApi';
import TransactionList from '../../components/kasir/TransactionList';
import TransactionDetail from '../../components/kasir/TransactionDetail';

export default function KasirHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all'); // all, paid, pending, failed
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
  
  // Modal
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, statusFilter, dateFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionApi.getHistory();
      setTransactions(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      alert('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = transactions;

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      result = result.filter(t => {
        const transactionDate = new Date(t.created_at);
        
        if (dateFilter === 'today') {
          return transactionDate.toDateString() === now.toDateString();
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transactionDate >= weekAgo;
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return transactionDate >= monthAgo;
        }
        return true;
      });
    }

    setFilteredTransactions(result);
  };

  const handleViewDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetail(true);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <HistoryIcon size={32} className="text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Transaction History</h1>
          <p className="text-gray-500 text-sm">View all your past transactions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h3 className="font-semibold text-gray-700">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Date Range
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-4 pt-4 border-t text-sm text-gray-600">
          <span>Total: <strong>{transactions.length}</strong></span>
          <span>Showing: <strong>{filteredTransactions.length}</strong></span>
          <span>Paid: <strong>{transactions.filter(t => t.status === 'paid').length}</strong></span>
        </div>
      </div>

      {/* Transaction List */}
      <TransactionList
        transactions={filteredTransactions}
        onViewDetail={handleViewDetail}
        loading={loading}
      />

      {/* Detail Modal */}
      {showDetail && selectedTransaction && (
        <TransactionDetail
          transaction={selectedTransaction}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}
