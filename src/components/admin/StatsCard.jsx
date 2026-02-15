import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function StatsCard({ title, value, icon: Icon, color, trend, onClick, navigateTo, sparklineData }) {
  const navigate = useNavigate();
  const [displayValue, setDisplayValue] = useState(0);

  // Simple Count-up animation
  useEffect(() => {
    let start = 0;
    // Extract number from string if it's a currency (e.g., "Rp 1.000.000" -> 1000000)
    const targetVal = typeof value === 'string'
      ? parseInt(value.replace(/[^0-9]/g, ''))
      : value;

    if (isNaN(targetVal)) {
      setDisplayValue(value);
      return;
    }

    const duration = 1000; // 1 second
    const increment = targetVal / (duration / 16); // ~60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetVal) {
        setDisplayValue(targetVal);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  const formatDisplay = (val) => {
    if (typeof value === 'string' && value.includes('Rp')) {
      return `Rp ${val.toLocaleString('id-ID')}`;
    }
    return val.toLocaleString('id-ID');
  };

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  const handleClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    } else if (onClick) {
      onClick();
    }
  };

  const isClickable = navigateTo || onClick;

  return (
    <div
      className={`card transition-all duration-300 ${isClickable
        ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 active:translate-y-0'
        : 'hover:shadow-lg'
        }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-h-[90px] flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mb-1">{formatDisplay(displayValue)}</p>
          </div>

          {/* Mini Sparkline */}
          {sparklineData && (
            <div className="h-10 w-full mt-1 mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : color === 'purple' ? '#8b5cf6' : '#f59e0b'}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="h-6"> {/* Fixed height container for trend to keep cards level */}
            {trend ? (
              <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${trend.isPositive
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-600'
                }`}>
                <span className="text-sm">{trend.isPositive ? '↑' : '↓'}</span>
                <span>{trend.percentage}% vs minggu lalu</span>
              </div>
            ) : (
              <div className="h-6" /> // Spacer for cards without trend
            )}
          </div>
        </div>
        <div className={`p-4 rounded-2xl ${colorClasses[color]} transition-transform ${isClickable ? 'group-hover:scale-110' : ''}`}>
          <Icon size={32} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
