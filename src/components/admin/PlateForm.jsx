import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function PlateForm({ plate, onSubmit, onClose, loading }) {
  const [formData, setFormData] = useState({
    rfid_uid: '',
    name: '',
    price: '',
    is_active: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (plate) {
      setFormData({
        rfid_uid: plate.rfid_uid || '',
        name: plate.name || '',
        price: plate.price || '',
        is_active: plate.is_active ?? true
      });
    }
  }, [plate]);

  const validate = () => {
    const newErrors = {};

    if (!formData.rfid_uid.trim()) {
      newErrors.rfid_uid = 'RFID UID is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Plate name is required';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onSubmit({
        ...formData,
        price: parseFloat(formData.price)
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full pointer-events-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {plate ? 'Edit Plate' : 'Add New Plate'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* RFID UID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RFID UID (Manual Input) *
            </label>
            <input
              type="text"
              name="rfid_uid"
              value={formData.rfid_uid}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono ${errors.rfid_uid ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="e.g., A001, B002, C003"
              disabled={!!plate} // Disable editing UID for existing plates
            />
            {errors.rfid_uid && (
              <p className="text-red-500 text-xs mt-1">{errors.rfid_uid}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Enter unique plate identifier (will be typed by Kasir during scan)
            </p>
          </div>

          {/* Plate Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plate Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Nasi Goreng Spesial"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (Rp) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="15000"
              min="0"
              step="500"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Active (available for scanning)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
  );
}
