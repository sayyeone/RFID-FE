import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
        <p className="text-xs text-gray-500 mt-0.5">RFID: {item.rfid_uid}</p>
        <p className="text-sm font-semibold text-primary mt-1">
          Rp {item.price.toLocaleString('id-ID')}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.rfid_uid, item.quantity - 1)}
          className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
        >
          <Minus size={16} className="text-gray-600" />
        </button>
        
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        
        <button
          onClick={() => updateQuantity(item.rfid_uid, item.quantity + 1)}
          className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
        >
          <Plus size={16} className="text-gray-600" />
        </button>

        <button
          onClick={() => removeFromCart(item.rfid_uid)}
          className="p-1.5 hover:bg-red-100 rounded-md transition-colors ml-2"
        >
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>
    </div>
  );
}
