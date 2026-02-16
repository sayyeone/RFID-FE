import { X, Printer, CheckCircle, Clock, XCircle, Calendar, CreditCard, User } from 'lucide-react';

export default function TransactionDetail({ transaction, onClose }) {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusConfig = (status) => {
    const configs = {
      paid: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Paid' },
      pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
      failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Failed' }
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(transaction.status);
  const StatusIcon = statusConfig.icon;
  const subtotal = transaction.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0 print:hidden">
          <div className="flex items-center gap-2 text-gray-800 font-bold">
            <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-mono">#{transaction.order_id || transaction.id.slice(0, 8)}</span>
            <span className="text-sm">Transaction Detail</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            >
              <Printer size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Area */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 print:p-0">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-white font-black text-xl">R</span>
                </div>
                <h1 className="text-xl font-bold text-gray-800 tracking-tight uppercase">POS RFID System</h1>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Office 149, 450 South Brand Brooklyn</p>
                <p>San Diego County, CA 91905, USA</p>
                <p>pos-rfid@support.com</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <h2 className="text-lg font-bold text-gray-800 mb-2 uppercase tracking-wide">
                Invoice #{transaction.order_id || transaction.id.slice(0, 8)}
              </h2>
              <div className="text-sm space-y-1">
                <div className="flex md:justify-end gap-2 text-gray-500">
                  <span>Date Created:</span>
                  <span className="font-semibold text-gray-700">{new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex md:justify-end gap-2 text-gray-500">
                  <span>Status:</span>
                  <span className={`font-bold uppercase ${statusConfig.color}`}>{statusConfig.label}</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mb-10" />

          {/* Info Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <div>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Bill To:</h3>
              <div className="text-sm">
                <p className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <User size={14} className="text-gray-400" />
                  {transaction.user_name || 'Walk-in Customer'}
                </p>
                <p className="text-gray-500 leading-relaxed ml-5">
                  ID: {transaction.user_id || 'GUEST-001'}<br />
                  Customer for RFID Services
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Info:</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <span className="text-gray-500">Method:</span>
                  <span className="font-semibold text-gray-700 uppercase">
                    {(() => {
                      const m = (transaction.payment_type || '').toLowerCase();
                      if (m.includes('qris')) return 'QRIS';
                      if (['gopay', 'shopeepay', 'dana', 'linkaja', 'wallet'].some(w => m.includes(w))) return 'E-Wallet';
                      if (['bank_transfer', 'va', 'bca', 'bni', 'bri', 'mandiri', 'permata', 'echannel'].some(b => m.includes(b))) return 'Bank VA';
                      if (['cstore', 'alfamart', 'indomaret'].some(r => m.includes(r))) return 'Retail';
                      if (['akulaku', 'kredivo'].some(p => m.includes(p))) return 'PayLater';
                      return m.replace(/_/g, ' ') || 'Digital Payment';
                    })()}
                  </span>
                </div>
                <div className="flex gap-2 shrink-0 overflow-hidden">
                  <span className="text-gray-500">Ref:</span>
                  <span className="font-mono text-gray-700 truncate">{transaction.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border border-gray-100 rounded-xl overflow-hidden mb-8">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-[#f8f9fa] border-b border-gray-100 font-semibold text-gray-700">
                <tr>
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4 text-center">Qty</th>
                  <th className="px-6 py-4 text-right">Unit Price</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transaction.items?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 font-semibold text-gray-800">{item.plate_name}</td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700">{item.quantity}</td>
                    <td className="px-6 py-4 text-right text-gray-600">Rp {item.price.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-800">
                      Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="text-sm text-gray-400">
              <p className="font-medium">POS RFID Transaction Record</p>
              <p className="mt-1">Generated on {new Date().toLocaleString('id-ID')}</p>
            </div>
            <div className="w-full md:w-64 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal:</span>
                <span className="font-semibold text-gray-700">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gray-800 uppercase tracking-wide">Grand Total:</span>
                <span className="text-xl font-black text-gray-900">
                  Rp {transaction.total_amount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3 shrink-0 print:hidden">
          <button
            onClick={onClose}
            className="flex-1 btn-primary py-2.5 font-bold"
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
}
