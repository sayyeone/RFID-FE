import { Calendar, Package, CheckCircle, Clock, XCircle, Eye, DollarSign } from 'lucide-react';

export default function TransactionList({ transactions, onViewDetail, loading }) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-500 mt-4 font-medium">Loading transactions...</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
          <DollarSign size={32} className="text-gray-300" />
        </div>
        <p className="text-gray-500 font-semibold text-lg">Belum ada transaksi</p>
        <p className="text-gray-400 text-sm mt-1">Gunakan filter lain atau mulai transaksi baru</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle size={14} />
            PAID
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
            <Clock size={14} />
            PENDING
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle size={14} />
            FAILED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status.toUpperCase()}
          </span>
        );
    }
  };

  const getPaymentBadge = (method) => {
    const m = method?.toLowerCase() || '';

    // QRIS
    if (m.includes('qris')) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">
          QRIS
        </span>
      );
    }

    // E-Wallets
    if (['gopay', 'shopeepay', 'dana', 'linkaja', 'wallet'].some(w => m.includes(w))) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
          E-Wallet
        </span>
      );
    }

    // Bank VA
    if (['bank_transfer', 'va', 'bca', 'bni', 'bri', 'mandiri', 'permata', 'echannel'].some(b => m.includes(b))) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
          Bank VA
        </span>
      );
    }

    // Retail
    if (['cstore', 'alfamart', 'indomaret'].some(r => m.includes(r))) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 uppercase tracking-wider">
          Retail
        </span>
      );
    }

    // PayLater
    if (['akulaku', 'kredivo'].some(p => m.includes(p))) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700 uppercase tracking-wider">
          PayLater
        </span>
      );
    }

    // Default
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wider">
        {method?.replace(/_/g, ' ') || 'N/A'}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              <div className="flex justify-start">Order ID</div>
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              <div className="flex justify-center">Date & Time</div>
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              <div className="flex justify-center">Items</div>
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              <div className="flex justify-center">Total</div>
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              <div className="flex justify-center">Status</div>
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              <div className="flex justify-center">Method</div>
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              <div className="flex justify-center">Actions</div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              onClick={() => onViewDetail(transaction)}
              className="group hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <td className="px-5 py-4">
                <div className="flex justify-start">
                  <span className="text-sm font-medium text-gray-400 font-mono">
                    #{transaction.order_id || transaction.id.slice(0, 8)}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4 whitespace-nowrap">
                <div className="flex justify-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                      {new Date(transaction.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(transaction.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-center">
                  <span className="text-sm text-gray-900 font-medium">
                    {transaction.items?.length || 0}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-center">
                  <span className="text-sm font-bold text-gray-900">
                    Rp {(transaction.total_amount || transaction.total_harga).toLocaleString('id-ID')}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-center">
                  {getStatusBadge(transaction.status)}
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-center">
                  {getPaymentBadge(transaction.payment_type)}
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-center">
                  <button
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                    aria-label="View Details"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
