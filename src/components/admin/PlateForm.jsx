import { useState, useEffect } from 'react';
import { X, Search, Check, ChevronDown, Edit2, AlertTriangle } from 'lucide-react';
import api from '../../api/axiosConfig';
import AlertModal from '../common/AlertModal';

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
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [errors, setErrors] = useState({});

  // Alert Modal State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null
  });

  useEffect(() => {
    fetchItems();
    if (plate) {
      setFormData({
        rfid_uid: plate.rfid_uid || '',
        item_id: plate.item_id || '',
        name: plate.item?.nama_item || plate.name || '',
        price: plate.item?.harga || plate.price || '',
        is_active: plate.status === '1'
      });
      setItemSearch(plate.item?.nama_item || plate.name || '');
      setIsEditingLink(false); // Default to read-only in edit mode
    } else {
      setIsEditingLink(true); // Open in create mode
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
      newErrors.item_id = 'Please select an item';
    }

    if (isNewItem) {
      if (!formData.name.trim()) {
        newErrors.name = 'Item name is required';
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
    setIsEditingLink(false);
    if (errors.item_id) setErrors(prev => ({ ...prev, item_id: '' }));
  };

  const handleSearchBlur = () => {
    // Small timeout to allow click events on dropdown to fire
    setTimeout(() => {
      if (!isNewItem && itemSearch.trim() && filteredItems.length === 0) {
        confirmNewItem();
      }
      setShowItemDropdown(false);
    }, 200);
  };

  const confirmNewItem = () => {
    setAlertConfig({
      isOpen: true,
      title: 'Menu Tidak Ditemukan',
      message: `Menu "${itemSearch}" tidak terdaftar. Apakah Anda ingin membuat menu baru dengan nama tersebut?`,
      type: 'confirm',
      confirmText: 'Ya, Buat Baru',
      cancelText: 'Cari Lagi',
      onConfirm: () => {
        setIsNewItem(true);
        setFormData(prev => ({ ...prev, item_id: '', name: itemSearch, price: '' }));
        setIsEditingLink(true);
      }
    });
  };

  const filteredItems = items.filter(item =>
    item.nama_item.toLowerCase().includes(itemSearch.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              {plate ? 'Edit Plate' : 'Add New Plate'}
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-400">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* RFID UID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RFID UID (Manual Input) *
              </label>
              <input
                type="text"
                value={formData.rfid_uid}
                onChange={(e) => setFormData({ ...formData, rfid_uid: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all font-mono ${errors.rfid_uid ? 'border-red-500 hover:border-red-600' : 'border-gray-300 hover:border-gray-400'}`}
                placeholder="Ex: 2023199"
                disabled={!!plate}
              />
              {errors.rfid_uid && <p className="text-red-500 text-xs mt-1">{errors.rfid_uid}</p>}
            </div>

            {/* Link to Item Section */}
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Link to Item *</label>
                {plate && !isEditingLink && !isNewItem && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingLink(true);
                      setItemSearch('');
                    }}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <Edit2 size={12} />
                    Ganti Menu
                  </button>
                )}
              </div>

              {!isEditingLink && !isNewItem ? (
                /* Read-only View */
                <div className="w-full px-3 py-2 border border-blue-100 bg-blue-50/30 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    <span className="text-sm font-semibold text-gray-700">{formData.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">Rp {formData.price.toLocaleString('id-ID')}</span>
                </div>
              ) : !isNewItem ? (
                /* Search View */
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
                      onBlur={handleSearchBlur}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all text-sm ${errors.item_id ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Search menu..."
                      autoComplete="off"
                      autoFocus
                    />
                  </div>

                  {showItemDropdown && (
                    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                      {fetchingItems ? (
                        <div className="p-3 text-center text-gray-400 text-xs italic">Memuat...</div>
                      ) : filteredItems.length === 0 ? (
                        <div className="p-3 text-center">
                          <p className="text-gray-400 text-xs">Tidak ditemukan</p>
                          <button
                            type="button"
                            onClick={confirmNewItem}
                            className="text-primary font-bold text-xs hover:underline mt-1"
                          >
                            + Daftarkan baru?
                          </button>
                        </div>
                      ) : (
                        filteredItems.map(item => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleItemSelect(item)}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors"
                          >
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">{item.nama_item}</p>
                              <p className="text-[10px] text-gray-500 capitalize">{item.kategori} • Rp {item.harga.toLocaleString('id-ID')}</p>
                            </div>
                            {formData.item_id === item.id && <Check size={16} className="text-primary" />}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* New Item View */
                <div className="p-3 border border-orange-100 bg-orange-50/20 rounded-lg space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-orange-600">
                      <AlertTriangle size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-tight">Add New Item</span>
                    </div>
                    <button type="button" onClick={() => { setIsNewItem(false); setIsEditingLink(true); }} className="text-[10px] text-orange-500 hover:underline">Batal</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 text-sm outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 text-sm outline-none"
                    />
                  </div>
                </div>
              )}
              {errors.item_id && <p className="text-red-500 text-xs mt-1 font-bold">{errors.item_id}</p>}
              {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name}</p>}
              {errors.price && <p className="text-red-500 text-xs mt-1 font-bold">{errors.price}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.is_active ? '1' : '0'}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === '1' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
              >
                <option value="1">Active (Available)</option>
                <option value="0">Inactive (Disabled)</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-all font-sans"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary py-2 font-semibold shadow-lg shadow-primary/10 transition-all active:scale-[0.98] font-sans text-white border-0"
                disabled={loading}
              >
                {loading ? 'Saving...' : (plate ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AlertModal
        {...alertConfig}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
