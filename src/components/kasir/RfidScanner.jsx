import { useState, useRef, useEffect } from 'react';
import { Scan, AlertCircle, CheckCircle } from 'lucide-react';
import { useRfid } from '../../hooks/useRfid';

export default function RfidScanner() {
  const [rfidInput, setRfidInput] = useState('');
  const [lastScanned, setLastScanned] = useState(null);
  const inputRef = useRef(null);
  const { scanRfid, loading, error, setError } = useRfid();

  useEffect(() => {
    // Auto focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleScan = async (e) => {
    e.preventDefault();
    
    try {
      const plate = await scanRfid(rfidInput);
      if (plate) {
        setLastScanned(plate);
        setRfidInput(''); // Clear input
        setTimeout(() => setLastScanned(null), 3000); // Clear success message after 3s
      }
    } catch (err) {
      // Error handled by useRfid hook
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 rounded-lg">
          <Scan className="text-primary" size={28} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">RFID Scanner</h2>
          <p className="text-sm text-gray-500">Scan or enter RFID UID</p>
        </div>
      </div>

      <form onSubmit={handleScan} className="space-y-4">
        <div>
          <input
            ref={inputRef}
            type="text"
            value={rfidInput}
            onChange={(e) => setRfidInput(e.target.value)}
            placeholder="Enter RFID UID (e.g., ABC123)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-mono"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !rfidInput.trim()}
          className="btn-primary w-full py-3 text-lg"
        >
          {loading ? 'Scanning...' : 'Scan Plate'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {lastScanned && !error && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
<div>
            <p className="text-sm font-medium text-green-800">
              Added: {lastScanned.name}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Rp {lastScanned.price.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs font-semibold text-gray-700 mb-2">Quick Guide:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Place RFID plate on scanner</li>
          <li>• Or manually type the UID and press Enter</li>
          <li>• Item will automatically be added to cart</li>
        </ul>
      </div>
    </div>
  );
}
