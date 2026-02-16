import RfidScanner from '../../components/kasir/RfidScanner';
import CartSummary from '../../components/kasir/CartSummary';
import { Package } from 'lucide-react';

export default function KasirPOS() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          <Package size={28} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Point of Sale</h1>
          <p className="text-gray-500 text-sm font-medium">Scan RFID plates to add to cart</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner Area */}
        <div className="lg:col-span-2">
          <RfidScanner />
        </div>

        {/* Cart Area */}
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
