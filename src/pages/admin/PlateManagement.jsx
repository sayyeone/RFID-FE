import { useState, useEffect } from 'react';
import { Package, Plus, Search } from 'lucide-react';
import { plateApi } from '../../api/plateApi';
import PlateTable from '../../components/admin/PlateTable';
import PlateForm from '../../components/admin/PlateForm';

export default function PlateManagement() {
  const [plates, setPlates] = useState([]);
  const [filteredPlates, setFilteredPlates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive
  
  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [selectedPlate, setSelectedPlate] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch plates
  useEffect(() => {
    fetchPlates();
  }, []);

  // Filter plates when search or filter changes
  useEffect(() => {
    let result = plates;

    // Search filter
    if (searchQuery) {
      result = result.filter(plate =>
        plate.rfid_uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plate.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter(plate =>
        filterStatus === 'active' ? plate.is_active : !plate.is_active
      );
    }

    setFilteredPlates(result);
  }, [plates, searchQuery, filterStatus]);

  const fetchPlates = async () => {
    setLoading(true);
    try {
      const response = await plateApi.getAll();
      setPlates(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch plates:', err);
      alert('Failed to load plates');
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

  const handleDelete = async (plate) => {
    if (window.confirm(`Are you sure you want to delete "${plate.name}"?`)) {
      try {
        await plateApi.delete(plate.id);
        alert('Plate deleted successfully');
        fetchPlates();
      } catch (err) {
        console.error('Failed to delete plate:', err);
        alert('Failed to delete plate: ' + (err.response?.data?.message || 'Unknown error'));
      }
    }
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (selectedPlate) {
        // Update
        await plateApi.update(selectedPlate.id, formData);
        alert('Plate updated successfully');
      } else {
        // Create
        await plateApi.create(formData);
        alert('Plate created successfully');
      }
      setShowForm(false);
      fetchPlates();
    } catch (err) {
      console.error('Failed to save plate:', err);
      alert('Failed to save plate: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setFormLoading(false);
    }
  };

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
          <span>Total: <strong>{plates.length}</strong></span>
          <span>Showing: <strong>{filteredPlates.length}</strong></span>
          <span>Active: <strong>{plates.filter(p => p.is_active).length}</strong></span>
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
    </div>
  );
}
