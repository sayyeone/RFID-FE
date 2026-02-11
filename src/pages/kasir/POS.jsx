import RfidScanner from '../../components/kasir/RfidScanner';
import CartSummary from '../../components/kasir/CartSummary';
import { Package } from 'lucide-react';

export default function KasirPOS() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Package size={32} className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Point of Sale</h1>
            <p className="text-gray-500">Scan RFID plates to add to cart</p>
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
    </div>
  );
}
