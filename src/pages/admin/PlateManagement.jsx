import { useState, useEffect } from 'react';
import { Package, Plus, Search } from 'lucide-react';
import api from '../../api/axiosConfig';
import AlertModal from '../../components/common/AlertModal';
import PlateTable from '../../components/admin/PlateTable';
import PlateForm from '../../components/admin/PlateForm';

export default function PlateManagement() {
  const [plates, setPlates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(10);

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [selectedPlate, setSelectedPlate] = useState(null);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null
  });

  const showAlert = (title, message, type = 'info', onConfirm = null) => {
    setAlertConfig({
      isOpen: true,
      title,
      message,
      type,
      onConfirm
    });
  };
  const [formLoading, setFormLoading] = useState(false);

  // Fetch plates when page or search changes
  useEffect(() => {
    fetchPlates();
  }, [currentPage, searchQuery, perPage]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchPlates(); // Fetch if already on page 1
    }
  }, [searchQuery, perPage]);

  const fetchPlates = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        per_page: perPage
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await api.get('/plates', { params }); // Changed API call
      setPlates(response.data.data || []);

      // Update pagination metadata
      if (response.data.meta) {
        setTotalPages(response.data.meta.last_page);
        setTotalItems(response.data.meta.total);
      }
    } catch (err) {
      console.error('Failed to fetch plates:', err);
      showAlert('Error', 'Gagal memuat data plate.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPlate(null);
    setShowForm(true);
  };

  const handleEdit = (plate) => {
    setSelectedPlate(plate);
    setShowForm(true);
  };

  const handleActivateAll = async () => {
    showAlert(
      'Aktivasi Masal',
      'Apakah Anda yakin ingin mengaktifkan SEMUA plate yang tidak aktif?',
      'confirm',
      async () => {
        try {
          await api.post('/plates/activate-all');
          showAlert('Berhasil', 'Semua plate telah berhasil diaktifkan.', 'success');
          fetchPlates();
        } catch (err) {
          showAlert('Gagal', 'Gagal mengaktifkan plate: ' + (err.response?.data?.message || 'Error tidak diketahui'), 'error');
        }
      }
    );
  };

  const handleDelete = async (plate) => {
    showAlert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus plate "${plate.name}" ? `,
      'confirm',
      async () => {
        try {
          await api.delete(`/ plates / ${plate.id} `); // Changed API call
          showAlert('Berhasil', 'Plate telah berhasil dihapus.', 'success'); // Changed alert
          fetchPlates();
        } catch (err) {
          showAlert('Gagal', 'Gagal menghapus plate: ' + (err.response?.data?.message || 'Error tidak diketahui'), 'error'); // Changed alert
        }
      }
    );
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (selectedPlate) {
        // Update
        await api.put(`/ plates / ${selectedPlate.id} `, formData); // Changed API call
        showAlert('Berhasil', 'Data plate berhasil diperbarui.', 'success'); // Changed alert
      } else {
        // Create
        await api.post('/plates', formData); // Changed API call
        showAlert('Berhasil', 'Plate baru telah ditambahkan.', 'success'); // Changed alert
      }
      setShowForm(false);
      fetchPlates();
    } catch (err) {
      console.error('Failed to save plate:', err);
      showAlert('Gagal Menyimpan', 'Terjadi kesalahan: ' + (err.response?.data?.message || 'Error tidak diketahui'), 'error'); // Changed alert
    } finally {
      setFormLoading(false);
    }
  };

  // Apply client-side status filter
  const filteredPlates = plates.filter(plate => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return plate.is_active;
    if (filterStatus === 'inactive') return !plate.is_active;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package size={32} className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Plate Management</h1>
            <p className="text-gray-500 text-sm">Manage RFID plates and pricing</p>
          </div>
        </div>
        <button onClick={handleCreate} className="btn-primary">
          <Plus size={20} className="inline mr-2" />
          Add Plate
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by RFID UID or plate name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-4 text-sm text-gray-600">
          <span>Total: <strong>{totalItems}</strong></span>
          <span>Showing: <strong>{filteredPlates.length}</strong> of {totalItems}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Show:</span>
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="text-xs border border-gray-200 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <PlateTable
          plates={filteredPlates}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <PlateForm
          plate={selectedPlate}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
          loading={formLoading}
        />
      )}

      <AlertModal
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
      />
    </div>
  );
}
