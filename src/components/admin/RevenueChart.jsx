import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Download, Calendar } from 'lucide-react';

export default function RevenueChart({ data, loading, onPeriodChange }) {
  const [filterType, setFilterType] = useState('quick');
  const [period, setPeriod] = useState('7days');
  const [customMonth, setCustomMonth] = useState(new Date().getMonth() + 1);
  const [customYear, setCustomYear] = useState(new Date().getFullYear());

  const handlePeriodChangeLocal = (e) => {
    const val = e.target.value;
    setPeriod(val);
    setFilterType('quick');

    if (onPeriodChange) {
      const daysMap = {
        'today': 1,
        '7days': 7,
        '30days': 30,
        '3months': 90,
        '6months': 180,
        '12months': 365
      };
      onPeriodChange(daysMap[val] || 7);
    }
  };

  const handleMonthYearFilter = () => {
    setFilterType('monthly');
    // TODO: Call API with month/year filter
    console.log(`Filtering by: ${customMonth}/${customYear}`);
  };

  const handleExport = () => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    let url = `${baseUrl}/dashboard/export`;

    // Add parameters if choosing specific range
    if (period === 'custom') {
      // Assuming state variables for dates exist or just using the inputs
      // For now, let's just trigger a general export or add simple logic
      alert('Fitur export dengan filter tanggal sedang disiapkan');
      return;
    }

    window.open(url, '_blank');
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
      <div className="flex flex-col gap-4 mb-6">
        {/* Header с Export Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-primary" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-semibold transition-colors"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col xl:flex-row gap-3">
          {/* Quick Filters */}
          <div className="flex-1 min-w-[140px]">
            <select
              value={period}
              onChange={handlePeriodChangeLocal}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer hover:bg-gray-50 transition-colors bg-white font-medium"
            >
              <option value="12months">Last 12 Months</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Custom Date Range inputs (conditional) */}
          {period === 'custom' && (
            <div className="flex items-center gap-2 w-full xl:w-auto animate-in fade-in slide-in-from-top-1">
              <input
                type="date"
                className="flex-1 xl:w-32 px-2 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="Start Date"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="date"
                className="flex-1 xl:w-32 px-2 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="End Date"
              />
              <button
                onClick={() => alert('Custom date range filter will be connected to backend')}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-primary rounded-lg transition-colors shrink-0"
                title="Apply custom range"
              >
                <TrendingUp size={16} />
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
            <div className="flex items-center gap-2 flex-1 sm:flex-initial min-w-[120px]">
              {/* Month Selector */}
              <select
                value={customMonth}
                onChange={(e) => setCustomMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer hover:bg-gray-50 transition-colors bg-white font-medium"
              >
                <option value="1">Januari</option>
                <option value="2">Februari</option>
                <option value="3">Maret</option>
                <option value="4">April</option>
                <option value="5">Mei</option>
                <option value="6">Juni</option>
                <option value="7">Juli</option>
                <option value="8">Agustus</option>
                <option value="9">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
            </div>

            <div className="flex items-center gap-2 flex-1 sm:flex-initial min-w-[100px]">
              {/* Year Selector */}
              <select
                value={customYear}
                onChange={(e) => setCustomYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer hover:bg-gray-50 transition-colors bg-white font-medium"
              >
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>

            {/* Apply Month/Year Filter Button */}
            <button
              onClick={handleMonthYearFilter}
              className="flex-1 sm:flex-initial px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-purple-700 transition-all hover:shadow-md flex items-center gap-2 justify-center shrink-0 active:scale-95"
            >
              <Calendar size={16} />
              <span>Apply</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        {/* Empty State */}
        {!data || data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 opacity-20">
              <TrendingUp size={64} className="text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Belum Ada Data Revenue</h4>
            <p className="text-sm text-gray-500 max-w-md">
              Grafik akan muncul setelah ada transaksi yang berhasil diselesaikan.
              Mulai catat transaksi pertama Anda untuk melihat tren revenue.
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
