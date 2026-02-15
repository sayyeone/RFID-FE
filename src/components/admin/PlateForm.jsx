import { useState, useEffect } from 'react';
import { X, Search, Check, ChevronDown, Plus } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function PlateForm({ plate, onSubmit, onClose, loading }) {
  const [formData, setFormData] = useState({
    rfid_uid: '',
    item_id: '',
    name: '',
    price: '',
    is_active: true
  });

  const [items, setItems] = useState([]);
  const [fetchingItems, setFetchingItems] = useState(false);
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [itemSearch, setItemSearch] = useState('');
  const [isNewItem, setIsNewItem] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchItems();
    if (plate) {
      setFormData({
        rfid_uid: plate.rfid_uid || '',
        item_id: plate.item_id || '',
        name: plate.name || '',
        price: plate.price || '',
        is_active: plate.is_active ?? true
      });
      if (!plate.item_id) setIsNewItem(true);
    }
  }, [plate]);

  const fetchItems = async () => {
    setFetchingItems(true);
    try {
      const response = await api.get('/items', { params: { per_page: 100 } });
      setItems(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setFetchingItems(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.rfid_uid.trim()) {
      newErrors.rfid_uid = 'RFID UID is required';
    }

    if (!isNewItem && !formData.item_id) {
      newErrors.item_id = 'Please select an existing item or create a new one';
    }

    if (isNewItem) {
      if (!formData.name.trim()) {
        newErrors.name = 'Plate name is required for new items';
      }
      if (!formData.price || formData.price <= 0) {
        newErrors.price = 'Price must be greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const payload = {
        rfid_uid: formData.rfid_uid,
        status: formData.is_active ? '1' : '0'
      };

      if (isNewItem) {
        payload.name = formData.name;
        payload.price = parseFloat(formData.price);
      } else {
        payload.item_id = formData.item_id;
      }

      onSubmit(payload);
    }
  };

  const handleItemSelect = (item) => {
    setFormData(prev => ({
      ...prev,
      item_id: item.id,
      name: item.nama_item,
      price: item.harga
    }));
    setItemSearch(item.nama_item);
    setShowItemDropdown(false);
    setIsNewItem(false);
    if (errors.item_id) setErrors(prev => ({ ...prev, item_id: '' }));
  };

  const toggleNewItem = () => {
    const nextState = !isNewItem;
    setIsNewItem(nextState);
    if (nextState) {
      setFormData(prev => ({ ...prev, item_id: '', name: '', price: '' }));
      setItemSearch('');
    }
  };

  const filteredItems = items.filter(item =>
    item.nama_item.toLowerCase().includes(itemSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {plate ? 'Edit Plate' : 'Add New Plate'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={24} />
          </button>
        </div>

        {/* Form Container */}
        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* RFID UID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RFID UID (Manual Input) *
              </label>
              <input
                type="text"
                value={formData.rfid_uid}
                onChange={(e) => setFormData({ ...formData, rfid_uid: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono ${errors.rfid_uid ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., A001, B002, C003"
                disabled={!!plate}
              />
              {errors.rfid_uid && <p className="text-red-500 text-xs mt-1">{errors.rfid_uid}</p>}
            </div>

            <hr className="border-gray-100" />

            {/* Item Relationship */}
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Link to Item *</label>
                <button
                  type="button"
                  onClick={toggleNewItem}
                  className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${isNewItem ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  {isNewItem ? 'Using New Item' : '+ Switch Item'}
                </button>
              </div>

              {!isNewItem ? (
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={itemSearch}
                      onChange={(e) => {
                        setItemSearch(e.target.value);
                        setShowItemDropdown(true);
                      }}
                      onFocus={() => setShowItemDropdown(true)}
                      className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 bg-white ${errors.item_id ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Search existing items..."
                      autoComplete="off"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  </div>

                  {showItemDropdown && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                      {fetchingItems ? (
                        <div className="p-3 text-center text-gray-500 text-sm italic">Loading items...</div>
                      ) : filteredItems.length === 0 ? (
                        <div className="p-3 text-center text-gray-500 text-sm">
                          Item not found.
                          <button onClick={toggleNewItem} className="text-primary font-bold block mx-auto mt-1 underline">Create as new?</button>
                        </div>
                      ) : (
                        filteredItems.map(item => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleItemSelect(item)}
                            className="w-full text-left px-4 py-2 hover:bg-purple-50 flex items-center justify-between border-b border-gray-50 last:border-0"
                          >
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">{item.nama_item}</p>
                              <p className="text-xs text-gray-500 capitalize">{item.kategori} • Rp {item.harga.toLocaleString('id-ID')}</p>
                            </div>
                            {formData.item_id === item.id && <Check size={16} className="text-primary" />}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div>
                    <input
                      type="text"
                      placeholder="Item name (e.g. Nasi Goreng)"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-1.5 border border-purple-200 rounded focus:ring-1 focus:ring-purple-500 text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Price (Rp)"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-1.5 border border-purple-200 rounded focus:ring-1 focus:ring-purple-500 text-sm"
                    />
                  </div>
                  <p className="text-[10px] text-purple-600 font-medium">* Category will be set to 'tambahan' by default</p>
                </div>
              )}
              {errors.item_id && <p className="text-red-500 text-xs mt-1">{errors.item_id}</p>}
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active (available for scanning)
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary py-2 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : (plate ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Backdrop for closing dropdown */}
      {showItemDropdown && (
        <div className="fixed inset-0 z-10" onClick={() => setShowItemDropdown(false)} />
      )}
    </div>
  );
}
