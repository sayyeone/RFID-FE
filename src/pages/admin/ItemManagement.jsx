import { useState, useEffect } from 'react';
import { Package, Plus, Search, UtensilsCrossed, Coffee, IceCream, Cookie, ShoppingBag, PlusCircle, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import api from '../../api/axiosConfig';
import AlertModal from '../../components/common/AlertModal';

export default function ItemManagement() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterKategori, setFilterKategori] = useState('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [perPage, setPerPage] = useState(10);

    // Modal states
    const [showForm, setShowForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
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

    // Kategori enum from backend with icons and colors
    const KATEGORI_CONFIG = {
        makanan: { icon: UtensilsCrossed, color: 'bg-orange-100 text-orange-700', label: 'Makanan' },
        minuman: { icon: Coffee, color: 'bg-blue-100 text-blue-700', label: 'Minuman' },
        dessert: { icon: IceCream, color: 'bg-pink-100 text-pink-700', label: 'Dessert' },
        camilan: { icon: Cookie, color: 'bg-yellow-100 text-yellow-700', label: 'Camilan' },
        paket: { icon: ShoppingBag, color: 'bg-purple-100 text-purple-700', label: 'Paket' },
        tambahan: { icon: PlusCircle, color: 'bg-green-100 text-green-700', label: 'Tambahan' }
    };
    const KATEGORI_OPTIONS = Object.keys(KATEGORI_CONFIG);

    useEffect(() => {
        fetchItems();
    }, [currentPage, searchQuery, filterKategori, perPage]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                per_page: perPage
            };

            if (searchQuery) {
                params.search = searchQuery;
            }

            if (filterKategori !== 'all') {
                params.kategori = filterKategori;
            }

            const response = await api.get('/items', { params });
            setItems(response.data.data || []);
            if (response.data.meta) {
                setTotalPages(response.data.meta.last_page);
                setTotalItems(response.data.meta.total);
            }
        } catch (err) {
            console.error('Failed to fetch items:', err);
            showAlert('Error', 'Gagal memuat data menu items.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            fetchItems(); // Explicitly fetch if already on page 1
        }
    }, [searchQuery, filterKategori, perPage]);

    const handleCreate = () => {
        setSelectedItem(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setShowForm(true);
    };

    const handleDelete = async (item) => {
        showAlert(
            'Konfirmasi Hapus',
            `Apakah Anda yakin ingin menghapus item "${item.nama_item}"? Tindakan ini tidak dapat dibatalkan.`,
            'confirm',
            async () => {
                try {
                    await api.delete(`/items/${item.id}`);
                    showAlert('Berhasil', 'Item telah berhasil dihapus.', 'success');
                    fetchItems();
                } catch (err) {
                    showAlert('Gagal', 'Terjadi kesalahan saat menghapus item: ' + (err.response?.data?.message || 'Error tidak diketahui'), 'error');
                }
            }
        );
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedItem) {
                await api.put(`/items/${selectedItem.id}`, formData);
                showAlert('Berhasil', 'Data item berhasil diperbarui.', 'success');
            } else {
                await api.post('/items', formData);
                showAlert('Berhasil', 'Item baru telah ditambahkan.', 'success');
            }
            setShowForm(false);
            fetchItems();
        } catch (err) {
            showAlert('Gagal Menyimpan', 'Terjadi kesalahan: ' + (err.response?.data?.message || 'Error tidak diketahui'), 'error');
        }
    };

    // Items are already filtered by backend
    const displayedItems = items;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Package size={32} className="text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Item Management</h1>
                        <p className="text-gray-500 text-sm">Manage menu items and pricing</p>
                    </div>
                </div>
                <button onClick={handleCreate} className="btn-primary">
                    <Plus size={20} className="inline mr-2" />
                    Add Item
                </button>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by item name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={filterKategori}
                        onChange={(e) => setFilterKategori(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent capitalize"
                    >
                        <option value="all">All Categories</option>
                        {KATEGORI_OPTIONS.map(kat => (
                            <option key={kat} value={kat} className="capitalize">{KATEGORI_CONFIG[kat].label}</option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-4 mt-4 text-sm text-gray-600">
                    <span>Total: <strong>{totalItems}</strong></span>
                    <span>Showing: <strong>{filteredItems.length}</strong> of {totalItems}</span>
                    {/* Pagination Settings */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Show</span>
                        <select
                            value={perPage}
                            onChange={(e) => setPerPage(Number(e.target.value))}
                            className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
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
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                        <p className="text-gray-500">Loading items...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="inline-block min-w-full align-middle">
                            <table className="w-full min-w-[640px]">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Item Name</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedItems.map(item => (
                                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">{item.nama_item}</td>
                                            <td className="py-3 px-4">
                                                {KATEGORI_CONFIG[item.kategori] && (() => {
                                                    const config = KATEGORI_CONFIG[item.kategori];
                                                    const IconComponent = config.icon;
                                                    return (
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                                                            <IconComponent size={16} />
                                                            <span className="capitalize">{item.kategori}</span>
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="py-3 px-4">Rp {item.harga.toLocaleString('id-ID')}</td>
                                            <td className="py-3 px-4">
                                                {item.status === '1' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle size={14} />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        <XCircle size={14} />
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="text-blue-600 hover:text-blue-900 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit Item"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Item"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {showForm && (
                <ItemForm
                    item={selectedItem}
                    onSubmit={handleSubmit}
                    onClose={() => setShowForm(false)}
                    kategoriOptions={KATEGORI_OPTIONS}
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

// ItemForm Component
function ItemForm({ item, onSubmit, onClose, kategoriOptions }) {
    const [formData, setFormData] = useState({
        nama_item: '',
        kategori: 'makanan',
        harga: '',
        status: '1'
    });

    useEffect(() => {
        if (item) {
            setFormData({
                nama_item: item.nama_item || '',
                kategori: item.kategori || 'makanan',
                harga: item.harga || '',
                status: item.status || '1'
            });
        }
    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {item ? 'Edit Item' : 'Add New Item'}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                        <input
                            type="text"
                            value={formData.nama_item}
                            onChange={(e) => setFormData({ ...formData, nama_item: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="Nasi Goreng Spesial"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <select
                            value={formData.kategori}
                            onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 capitalize"
                            required
                        >
                            {kategoriOptions.map(kat => (
                                <option key={kat} value={kat} className="capitalize">{kat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rp) *</label>
                        <input
                            type="number"
                            value={formData.harga}
                            onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="15000"
                            min="0"
                            step="500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="1">Active (Available)</option>
                            <option value="0">Inactive (Sold Out)</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn-primary py-2"
                        >
                            {item ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
