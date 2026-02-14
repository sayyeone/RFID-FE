import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award } from 'lucide-react';

export default function PopularPlatesChart({ data, loading }) {
  if (loading) {
    return (
      <div className="card h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Award className="text-primary" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Popular Plates</h3>
        </div>
        <div className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded">
          Top 5 Items
        </div>
      </div>

      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <div className="min-w-[500px] sm:min-w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number"
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
                width={80} // Reduced width for mobile
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  fontSize: '12px'
                }}
                formatter={(value) => [value, 'Sold']}
              />
              <Bar
                dataKey="sold"
                fill="#8b5cf6"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
