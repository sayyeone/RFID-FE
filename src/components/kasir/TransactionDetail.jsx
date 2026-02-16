import { X, CheckCircle, Printer, Calendar, User, CreditCard, Clock, XCircle, Hash } from 'lucide-react';
import { generateInvoiceHtml } from '../../utils/printTemplate';

export default function TransactionDetail({ transaction, onClose }) {
  if (!transaction) return null;

  const subtotal = transaction.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
  const orderId = transaction.order_id || (transaction.id ? String(transaction.id).slice(0, 12).toUpperCase() : 'UNNAMED');

  const getStatusConfig = (status) => {
    const configs = {
      paid: { color: 'text-green-600', bg: 'bg-green-100', label: 'Paid', dot: 'bg-green-500' },
      pending: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending', dot: 'bg-yellow-500' },
      failed: { color: 'text-red-600', bg: 'bg-red-100', label: 'Failed', dot: 'bg-red-500' }
    };
    return configs[status] || configs.pending;
  };

  const statusCfg = getStatusConfig(transaction.status);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Popup blocked! Please allow popups for this site to print the invoice.');
      return;
    }
    const date = new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const method = (() => {
      const m = (transaction.payment_type || '').toLowerCase();
      if (m.includes('qris')) return 'QRIS Gateway';
      if (['gopay', 'shopeepay', 'dana', 'linkaja', 'wallet'].some(w => m.includes(w))) return 'Digital Wallet';
      if (['bank_transfer', 'va', 'bca', 'bni', 'bri', 'mandiri', 'permata', 'echannel'].some(b => m.includes(b))) return 'Bank Transfer (VA)';
      return m.replace(/_/g, ' ') || 'Digital Payment';
    })();

    const itemsHtml = transaction.items?.filter(Boolean).map(item => `
      <tr>
        <td style="padding: 12px 15px; border-bottom: 1px solid #f0f2f4;">
          <div style="font-weight: 600; color: #444;">${item.plate_name || 'Item'}</div>
          <div style="font-size: 11px; color: #999; text-transform: uppercase;">RFID TAG VERIFIED</div>
        </td>
        <td style="padding: 12px 15px; text-align: center; border-bottom: 1px solid #f0f2f4;">${item.quantity || 0}</td>
        <td style="padding: 12px 15px; text-align: right; border-bottom: 1px solid #f0f2f4;">Rp ${(item.price || 0).toLocaleString('id-ID')}</td>
        <td style="padding: 12px 15px; text-align: right; font-weight: 700; color: #333; border-bottom: 1px solid #f0f2f4;">Rp ${((item.quantity || 0) * (item.price || 0)).toLocaleString('id-ID')}</td>
      </tr>
    `).join('') || '';

    printWindow.document.write(generateInvoiceHtml(transaction, orderId, method, date, subtotal, itemsHtml));
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col font-['Public_Sans',_sans-serif]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <h3 className="text-xl font-semibold text-gray-800 tracking-tight">Transaction Detail</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-all"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white">
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg shadow-primary/20">R</div>
              <div>
                <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight">POS RFID System</h1>
                <p className="text-[11px] text-gray-500 mt-1 max-w-[250px] leading-relaxed">
                  Office 149, 450 South Brand Brooklyn,<br />
                  San Diego County, CA 91905, USA<br />
                  pos-rfid@support.com
                </p>
              </div>
            </div>
            <div className="md:text-right">
              <h2 className="text-lg font-bold text-gray-800 mb-1">INVOICE #{orderId}</h2>
              <div className="flex flex-col gap-1 items-start md:items-end">
                <p className="text-[11px] text-gray-400 font-medium">Date Created: <span className="text-gray-700 font-bold ml-1">{new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></p>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Status: <span className={`font-black ml-1 ${statusCfg.color}`}>{statusCfg.label.toUpperCase()}</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10 pt-8 border-t border-gray-50">
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bill To:</h3>
              <div className="flex items-start gap-2">
                <User size={14} className="text-gray-300 mt-1" />
                <div>
                  <p className="font-bold text-gray-800 text-sm mb-0.5">{transaction.user_name || 'Walk-in Customer'}</p>
                  <p className="text-[11px] text-gray-500">ID: {transaction.user_id || 'Guest'}</p>
                  <p className="text-[11px] text-gray-500">Customer for RFID Services</p>
                </div>
              </div>
            </div>
            <div className="text-right space-y-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Info:</h3>
              <div className="inline-block text-right">
                <p className="text-[11px] text-gray-500 mb-1 font-medium">Method: <span className="font-bold text-gray-800 uppercase ml-1">{transaction.payment_type || 'MIDTRANS'}</span></p>
                <p className="text-[11px] text-gray-500 font-medium">Ref: <span className="font-bold text-gray-800 ml-1">{transaction.id ? String(transaction.id).slice(0, 8).toUpperCase() : 'N/A'}</span></p>
              </div>
            </div>
          </div>

          <div className="mb-10 rounded-xl border border-gray-50 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-3 px-5 text-left font-bold text-gray-400 uppercase tracking-wider text-[10px]">Item Name</th>
                  <th className="py-3 px-5 text-center font-bold text-gray-400 uppercase tracking-wider text-[10px]">Qty</th>
                  <th className="py-3 px-5 text-right font-bold text-gray-400 uppercase tracking-wider text-[10px]">Unit Price</th>
                  <th className="py-3 px-5 text-right font-bold text-gray-400 uppercase tracking-wider text-[10px]">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transaction.items?.filter(Boolean).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/30 transition-colors">
                    <td className="py-4 px-5 font-bold text-gray-800 text-sm">{item.plate_name || 'Item'}</td>
                    <td className="py-4 px-5 text-center text-gray-600 text-sm font-semibold">{item.quantity || 0}</td>
                    <td className="py-4 px-5 text-right text-gray-500 text-sm italic">Rp {(item.price || 0).toLocaleString('id-ID')}</td>
                    <td className="py-4 px-5 text-right font-black text-gray-800 text-sm">Rp {((item.quantity || 0) * (item.price || 0)).toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start pt-8 border-t border-gray-50 gap-6">
            <div className="text-[10px] text-gray-400">
              <p className="font-bold text-gray-500 mb-1">POS RFID Transaction Record</p>
              Generated on {new Date().toLocaleString('id-ID')}
            </div>
            <div className="w-full md:w-64 space-y-3">
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>Subtotal:</span>
                <span className="text-gray-600 font-bold">Rp {(subtotal || 0).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-baseline text-black border-t border-gray-100 pt-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">GRAND TOTAL:</span>
                <span className="text-2xl font-black tracking-tight text-black">Rp {(transaction.total_amount || transaction.total_harga || 0).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-white border-t border-gray-100 flex items-center justify-end gap-4 shrink-0">
          <button
            onClick={onClose}
            className="px-8 py-2.5 border border-gray-200 text-gray-500 font-semibold rounded-lg hover:bg-gray-50 transition-all text-sm"
          >
            Close Detail
          </button>
          <button
            onClick={handlePrint}
            className="px-8 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-md shadow-primary/20 transition-all flex items-center gap-2 text-sm"
          >
            <Printer size={18} />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
