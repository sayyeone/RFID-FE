import { Award, TrendingUp, Download } from 'lucide-react';

export default function PopularPlatesList({ data, loading }) {
    if (loading) {
        return (
            <div className="card h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const handleExport = () => {
        alert('Export Popular Plates functionality will be implemented with backend API');
    };

    // Calculate max value for progress bar percentage
    const maxSold = data && data.length > 0 ? Math.max(...data.map(p => p.sold)) : 1;

    return (
        <div className="card h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Award className="text-primary" size={24} />
                    <h3 className="text-lg font-semibold text-gray-800">Popular Plates</h3>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-semibold transition-colors"
                >
                    <Download size={16} />
                    <span className="hidden sm:inline">Export</span>
                </button>
            </div>

            {!data || data.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mb-4 flex justify-center opacity-20">
                        <Award size={56} className="text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Belum Ada Plate Populer</h4>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto">
                        Data akan muncul setelah ada transaksi berhasil yang menggunakan plate Anda.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data.map((plate, index) => {
                        const percentage = (plate.sold / maxSold) * 100;
                        const isTopOne = index === 0;

                        return (
                            <div key={plate.id} className="group cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-gray-400 w-6">#{index + 1}</span>
                                        <p className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                                            {plate.name}
                                        </p>
                                        {isTopOne && (
                                            <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full flex items-center gap-1">
                                                🔥 Most Used
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-primary">{plate.sold}x</span>
                                        <TrendingUp size={14} className="text-green-500" />
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${isTopOne
                                            ? 'bg-gradient-to-r from-orange-400 to-orange-600'
                                            : 'bg-gradient-to-r from-primary to-purple-600'
                                            }`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
