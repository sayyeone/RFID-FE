import { X, CheckCircle, Printer, Download } from 'lucide-react';

export default function InvoiceModal({ transaction, paymentResult, onClose }) {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const subtotal = transaction.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
  const tax = 0; // Or calculate if available
  const discount = 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Modal Header (Not part of printed invoice) */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0 print:hidden">
          <div className="flex items-center gap-2 text-green-600 font-bold">
            <CheckCircle size={20} />
            <span>Pembayaran Berhasil</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
              title="Print Invoice"
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

        {/* Invoice Content (The part that looks like Sneat) */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 bg-white print:p-0" id="invoice-content">
          {/* Invoice Header */}
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
                <p>+1 (123) 456 7891, +44 (876) 543 2198</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <h2 className="text-lg font-bold text-gray-800 mb-2 uppercase tracking-wide">
                Invoice #{paymentResult?.order_id || transaction.order_id || transaction.id.slice(0, 8)}
              </h2>
              <div className="text-sm space-y-1">
                <div className="flex md:justify-end gap-2 text-gray-500">
                  <span>Date Issues:</span>
                  <span className="font-semibold text-gray-700">{new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex md:justify-end gap-2 text-gray-500">
                  <span>Status:</span>
                  <span className="font-bold text-green-600 uppercase">Paid</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mb-10" />

          {/* Billing Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <div>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Invoice To:</h3>
              <div className="text-sm">
                <p className="font-bold text-gray-800 mb-1">{transaction.user_name || 'Guest Customer'}</p>
                <p className="text-gray-500 leading-relaxed">
                  Regular Customer<br />
                  RFID POS Transaction<br />
                  Self-Service Checkout
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Method:</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <span className="text-gray-500">Payment Type:</span>
                  <span className="font-semibold text-gray-700 uppercase">
                    {(() => {
                      const m = (transaction.payment_type || paymentResult?.payment_type || '').toLowerCase();
                      if (m.includes('qris')) return 'QRIS';
                      if (['gopay', 'shopeepay', 'dana', 'linkaja', 'wallet'].some(w => m.includes(w))) return 'E-Wallet';
                      if (['bank_transfer', 'va', 'bca', 'bni', 'bri', 'mandiri', 'permata', 'echannel'].some(b => m.includes(b))) return 'Bank VA';
                      if (['cstore', 'alfamart', 'indomaret'].some(r => m.includes(r))) return 'Retail';
                      if (['akulaku', 'kredivo'].some(p => m.includes(p))) return 'PayLater';
                      return m.replace(/_/g, ' ') || 'Digital Payment';
                    })()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500">Transaction ID:</span>
                  <span className="font-mono text-gray-700">{transaction.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
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

          {/* Summary */}
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="text-sm italic text-gray-400">
              <p>Salesperson: System Automated</p>
              <p className="mt-1">Thanks for your business!</p>
            </div>
            <div className="w-full md:w-64 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal:</span>
                <span className="font-semibold text-gray-700">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Discount:</span>
                <span className="font-semibold text-gray-700">Rp {discount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax:</span>
                <span className="font-semibold text-gray-700">Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gray-800 uppercase tracking-wide">Total:</span>
                <span className="text-xl font-black text-gray-900">
                  Rp {transaction.total_amount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer (Actions) */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3 shrink-0 print:hidden">
          <button
            onClick={onClose}
            className="flex-1 btn-primary py-3 font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
