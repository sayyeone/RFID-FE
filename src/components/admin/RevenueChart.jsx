import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function RevenueChart({ data, loading, onPeriodChange }) {
  const [period, setPeriod] = useState('7days');

  const handlePeriodChangeLocal = (e) => {
    const val = e.target.value;
    setPeriod(val);
    if (onPeriodChange) {
      onPeriodChange(val === '7days' ? 7 : 30);
    }
  };

  if (loading) {
    return (
      <div className="card h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="card h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-primary" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
        </div>
        <select
          value={period}
          onChange={handlePeriodChangeLocal}
          className="w-full sm:w-auto px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none cursor-pointer hover:bg-gray-50 transition-colors bg-white"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>

      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <div className="min-w-[500px] sm:min-w-full">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
                tick={{ fill: '#9ca3af' }}
                tickMargin={10}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
                tick={{ fill: '#9ca3af' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                width={45}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  fontSize: '12px'
                }}
                formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
