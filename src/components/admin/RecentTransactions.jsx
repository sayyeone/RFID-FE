import { Clock, CheckCircle, XCircle } from 'lucide-react';

export default function RecentTransactions({ transactions, loading }) {
  const CardContainer = ({ children }) => (
    <div className="card h-[500px] flex flex-col">
      <div className="flex items-center gap-2 mb-6 shrink-0">
        <Clock className="text-primary" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
      </div>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="card h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <CardContainer>
        <div className="flex-1 flex flex-col items-center justify-center py-12">
          <div className="mb-4 flex justify-center opacity-20">
            <Clock size={56} className="text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Belum Ada Transaksi</h4>
          <p className="text-sm text-gray-500 max-w-sm mx-auto text-center px-4">
            Transaksi akan muncul di sini setelah pelanggan menyelesaikan pembelian pertama mereka.
          </p>
        </div>
      </CardContainer>
    );
  }

  return (
    <CardContainer>
      <div className="flex-1 overflow-y-auto pr-1 -mr-1 scrollbar-thin scrollbar-thumb-gray-200">
        <div className="space-y-3 pb-2">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-2"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800 text-sm">
                    Order #{transaction.order_id}
                  </p>
                  {transaction.status === 'paid' ? (
                    <CheckCircle size={14} className="text-green-600" />
                  ) : (
                    <XCircle size={14} className="text-red-600" />
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                  {new Date(transaction.created_at).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                <p className="font-bold text-primary text-sm sm:text-base">
                  Rp {transaction.total_amount.toLocaleString('id-ID')}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    {transaction.items_count || transaction.items?.length || 0} items
                  </p>
                  {(() => {
                    const m = transaction.payment_type?.toLowerCase() || '';
                    let config = { label: transaction.payment_type || 'N/A', color: 'bg-gray-100 text-gray-500' };

                    if (m.includes('qris')) config = { label: 'QRIS', color: 'bg-emerald-100 text-emerald-700' };
                    else if (['gopay', 'shopeepay', 'dana', 'linkaja', 'wallet'].some(w => m.includes(w))) config = { label: 'E-Wallet', color: 'bg-blue-100 text-blue-700' };
                    else if (['bank_transfer', 'va', 'bca', 'bni', 'bri', 'mandiri', 'permata', 'echannel'].some(b => m.includes(b))) config = { label: 'Bank VA', color: 'bg-indigo-100 text-indigo-700' };
                    else if (['cstore', 'alfamart', 'indomaret'].some(r => m.includes(r))) config = { label: 'Retail', color: 'bg-orange-100 text-orange-700' };
                    else if (['akulaku', 'kredivo'].some(p => m.includes(p))) config = { label: 'PayLater', color: 'bg-violet-100 text-violet-700' };

                    return (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${config.color}`}>
                        {config.label}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full mt-4 py-2 text-sm text-primary hover:bg-purple-50 rounded-lg transition-colors shrink-0 font-semibold border-t border-gray-50 pt-3">
        View All Transactions →
      </button>
    </CardContainer>
  );
}
