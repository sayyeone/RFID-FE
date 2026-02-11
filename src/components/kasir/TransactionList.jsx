import { Calendar, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function TransactionList({ transactions, onViewDetail, loading }) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading transactions...</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign size={48} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No transactions found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={18} className="text-green-600" />;
      case 'pending':
        return <Clock size={18} className="text-yellow-600" />;
      case 'failed':
        return <XCircle size={18} className="text-red-600" />;
      default:
        return <Clock size={18} className="text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          onClick={() => onViewDetail(transaction)}
          className="card hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-gray-800">
                  Order #{transaction.order_id}
                </h4>
                {getStatusIcon(transaction.status)}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{new Date(transaction.created_at).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <span>•</span>
                <span>{transaction.items?.length || 0} items</span>
              </div>

              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(transaction.status)}`}>
                {transaction.status.toUpperCase()}
              </span>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                Rp {transaction.total_amount.toLocaleString('id-ID')}
              </p>
              <button className="mt-2 text-sm text-purple-600 hover:text-purple-700">
                View Details →
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
