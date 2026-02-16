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
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
        <p className="text-gray-500 font-medium">No plates found</p>
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
              RFID UID
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              Plate Name
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-gray-700">
              Price
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-gray-700 text-center">
              Status
            </th>
            <th className="px-5 py-4 text-sm font-semibold text-gray-700 text-right w-[100px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {plates.map((plate) => (
            <tr key={plate.id} className="group hover:bg-gray-50 transition-colors">
              <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                {plate.rfid_uid}
              </td>
              <td className={`px-5 py-4 whitespace-nowrap text-sm ${plate.is_active ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                {plate.name}
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                Rp {plate.price.toLocaleString('id-ID')}
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-center">
                {plate.is_active ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <CheckCircle size={14} />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    <XCircle size={14} />
                    Inactive
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(plate)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Plate"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(plate)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
