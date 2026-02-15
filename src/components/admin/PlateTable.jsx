import { Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function PlateTable({ plates, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading plates...</p>
      </div>
    );
  }

  if (!plates || plates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No plates found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or add a new plate</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <table className="w-full min-w-[768px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                RFID UID
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Plate Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Price
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {plates.map((plate) => (
              <tr key={plate.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {plate.rfid_uid}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm ${plate.is_active ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                  {plate.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  Rp {plate.price.toLocaleString('id-ID')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {plate.is_active ? (
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
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(plate)}
                      className="text-blue-600 hover:text-blue-900 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Plate"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(plate)}
                      className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Plate"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
