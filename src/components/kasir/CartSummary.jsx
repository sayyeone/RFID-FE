import { ShoppingCart, CreditCard, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTransaction } from '../../hooks/useTransaction';
import CartItem from './CartItem';

export default function CartSummary() {
  const { cartItems, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { createTransaction, loading } = useTransaction();

  const handleCheckout = async () => {
    if (window.confirm('Proceed with payment?')) {
      try {
        await createTransaction();
        alert('Transaction successful!');
      } catch (err) {
        alert('Transaction failed: ' + err.message);
      }
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart size={24} className="text-primary" />
          <h3 className="text-lg font-semibold">Cart</h3>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4 max-h-[400px]">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No items in cart</p>
            <p className="text-gray-400 text-xs mt-1">Start scanning plates</p>
          </div>
        ) : (
          cartItems.map(item => (
            <CartItem key={item.rfid_uid} item={item} />
          ))
        )}
      </div>

      {/* Summary */}
      {cartItems.length > 0 && (
        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Items:</span>
            <span className="font-semibold">{getTotalItems()}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-primary">
              Rp {getTotalPrice().toLocaleString('id-ID')}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="btn-primary w-full py-3 text-lg"
          >
            {loading ? 'Processing...' : (
              <>
                <CreditCard size={20} className="inline mr-2" />
                Pay Now
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
