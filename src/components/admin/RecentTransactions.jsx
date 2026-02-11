import { Clock, CheckCircle, XCircle } from 'lucide-react';

export default function RecentTransactions({ transactions, loading }) {
  if (loading) {
    return (
      <div className="card h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="text-primary" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
        </div>
        <div className="text-center py-8 text-gray-400">
          No transactions yet
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="text-primary" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800 text-sm">
                  Order #{transaction.order_id}
                </p>
                {transaction.status === 'paid' ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <XCircle size={16} className="text-red-600" />
                )}
              </div>
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
              <p className="text-xs text-gray-500 mt-1">
                {transaction.items_count} items
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-primary hover:bg-purple-50 rounded-lg transition-colors">
        View All Transactions →
      </button>
    </div>
  );
}
