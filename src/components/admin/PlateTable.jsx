import { Edit2, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';

export default function PlateTable({ plates, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-500 mt-4 font-medium">Loading plates...</p>
      </div>
    );
  }

  if (!plates || plates.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
          <Search size={32} className="text-gray-300" />
        </div>
        <p className="text-gray-500 font-semibold text-lg">No plates found</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or add a new plate</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              <div className="flex justify-start">RFID UID</div>
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              <div className="flex justify-center">Plate Name</div>
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              <div className="flex justify-end">Price</div>
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              <div className="flex justify-center">Status</div>
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              <div className="flex justify-center">Actions</div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {plates.map((plate) => (
            <tr key={plate.id} className="group hover:bg-gray-50 transition-colors">
              <td className="px-5 py-4">
                <div className="flex justify-start">
                  <span className="text-sm text-gray-400 font-mono">
                    {plate.rfid_uid}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-center">
                  <span className={`text-sm whitespace-nowrap ${plate.is_active ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                    {plate.name}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-end">
                  <span className="text-sm text-gray-900 font-bold whitespace-nowrap">
                    Rp {plate.price.toLocaleString('id-ID')}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-center">
                  {plate.is_active ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <CheckCircle size={14} />
                      ACTIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      <XCircle size={14} />
                      INACTIVE
                    </span>
                  )}
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(plate)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Plate"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(plate)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Plate"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}