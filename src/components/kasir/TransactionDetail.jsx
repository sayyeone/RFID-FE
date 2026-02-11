import { X, Printer, CheckCircle, Clock, XCircle, Calendar, CreditCard } from 'lucide-react';

export default function TransactionDetail({ transaction, onClose }) {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusConfig = (status) => {
    const configs = {
      paid: {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-100',
        label: 'PAID'
      },
      pending: {
        icon: Clock,
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
        label: 'PENDING'
      },
      failed: {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-100',
        label: 'FAILED'
      }
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(transaction.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Transaction Detail</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Status Banner */}
          <div className={`flex items-center justify-center gap-2 p-4 rounded-lg ${statusConfig.bg}`}>
            <StatusIcon size={24} className={statusConfig.color} />
            <span className={`text-lg font-bold ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>

          {/* Order Info */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Order Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono font-semibold">{transaction.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono">{transaction.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date & Time:</span>
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="text-gray-500" />
                  <span>{new Date(transaction.created_at).toLocaleString('id-ID')}</span>
                </div>
              </div>
              {transaction.payment_type && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Method:</span>
                  <div className="flex items-center gap-1">
                    <CreditCard size={14} className="text-gray-500" />
                    <span className="capitalize">{transaction.payment_type}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Items ({transaction.items?.length || 0})</h3>
            <div className="space-y-2">
              {transaction.items?.map((item, index) => (
                <div key={index} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{item.plate_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-gray-800">Total Amount</span>
              <span className="text-3xl font-bold text-primary">
                Rp {transaction.total_amount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer size={18} />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="flex-1 btn-primary py-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
