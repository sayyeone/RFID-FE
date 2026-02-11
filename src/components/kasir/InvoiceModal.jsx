import { X, CheckCircle, Printer } from 'lucide-react';

export default function InvoiceModal({ transaction, paymentResult, onClose }) {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-green-500 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Payment Successful!</h2>
            <button onClick={onClose} className="p-1 hover:bg-green-600 rounded">
              <X size={24} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={48} />
            <div>
              <p className="text-sm opacity-90">Transaction ID</p>
              <p className="font-mono font-semibold">{transaction.id}</p>
            </div>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-6">
          {/* Transaction Info */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Transaction Details</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono">{paymentResult?.order_id || transaction.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span>{new Date(transaction.created_at).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Type:</span>
                <span className="capitalize">{paymentResult?.payment_type || 'Midtrans'}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Items</h3>
            <div className="space-y-2">
              {transaction.items?.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.plate_name}</p>
                    <p className="text-gray-500 text-xs">
                      {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <p className="font-semibold">
                    Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">Total Paid</span>
              <span className="text-2xl font-bold text-green-600">
                Rp {transaction.total_amount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer size={18} />
              Print
            </button>
            <button
              onClick={onClose}
              className="flex-1 btn-primary py-2"
            >
              Done
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 rounded-b-xl text-center">
          <p className="text-xs text-gray-500">Thank you for your purchase!</p>
          <p className="text-xs text-gray-400 mt-1">POS RFID System © 2024</p>
        </div>
      </div>
    </div>
  );
}
