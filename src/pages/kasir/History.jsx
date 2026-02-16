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
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Modal
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // Pagination states matching Admin style
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const totalPages = Math.ceil(filteredTransactions.length / perPage);

  // Get current page items
  const displayedTransactions = filteredTransactions.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1); // Reset to first page on filter change
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
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          <HistoryIcon size={28} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">History Transaksi</h1>
          <p className="text-gray-500 text-sm">Pantau semua aktivitas penjualan Anda</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
          <span className="whitespace-nowrap">Total: <strong>{transactions.length}</strong></span>
          <span className="whitespace-nowrap">Showing: <strong>{filteredTransactions.length}</strong> of {transactions.length}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <button
            onClick={() => { setDateFilter('all'); setStatusFilter('all'); }}
            className="ml-auto text-xs font-bold text-primary hover:underline uppercase tracking-tight"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Transaction List Card */}
      <div className="card !p-0 overflow-hidden">
        <TransactionList
          transactions={displayedTransactions}
          onViewDetail={handleViewDetail}
          loading={loading}
        />

        {/* Pagination Controls - Matching Admin Style */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-gray-100 bg-gray-50/50">
            <p className="text-sm text-gray-600 text-center sm:text-left">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </p>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-gray-500 text-sm"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="flex-1 sm:flex-none px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-sm shadow-md shadow-primary/20"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

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
