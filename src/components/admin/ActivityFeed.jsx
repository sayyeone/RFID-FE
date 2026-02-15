import { Bell, UserPlus, Package, ShoppingCart, Info, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ActivityFeed({ activities = [] }) {
    const getActionConfig = (action, model) => {
        switch (action) {
            case 'created':
                return { icon: UserPlus, color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-500' };
            case 'updated':
                return { icon: Info, color: 'bg-indigo-500', bgColor: 'bg-indigo-50', textColor: 'text-indigo-500' };
            case 'deleted':
                return { icon: AlertCircle, color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-500' };
            case 'paid':
                return { icon: CheckCircle2, color: 'bg-green-500', bgColor: 'bg-green-50', textColor: 'text-green-500' };
            case 'failed':
                return { icon: XCircle, color: 'bg-orange-500', bgColor: 'bg-orange-50', textColor: 'text-orange-500' };
            default:
                return { icon: Bell, color: 'bg-gray-400', bgColor: 'bg-gray-50', textColor: 'text-gray-400' };
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="card h-full">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <Bell className="text-primary" size={24} />
                    <h3 className="text-lg font-semibold text-gray-800">Activity Timeline</h3>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Info size={18} />
                </button>
            </div>

            <div className="relative pl-6">
                {/* Timeline Line */}
                <div className="absolute left-[30px] top-2 bottom-2 w-0.5 bg-gray-100" />

                <div className="space-y-8">
                    {activities.length > 0 ? (
                        activities.map((act) => {
                            const config = getActionConfig(act.action, act.model);
                            const Icon = config.icon;

                            return (
                                <div key={act.id} className="relative flex gap-4 pr-2 group">
                                    {/* Timeline Dot & Icon */}
                                    <div className={`absolute -left-[6px] z-10 w-3 h-3 rounded-full border-2 border-white ${config.color}`} />

                                    <div className="flex-1 ml-4 -mt-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">
                                                {act.description}
                                            </h4>
                                            <span className="text-[11px] text-gray-400 whitespace-nowrap ml-2">
                                                {formatTime(act.created_at)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mt-2">
                                            <div className={`p-1.5 rounded-lg ${config.bgColor} ${config.textColor}`}>
                                                <Icon size={14} />
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {act.user?.name || 'System'} • {act.model || 'General'}
                                            </p>
                                        </div>

                                        {/* Optional: Show extra details if properties exist */}
                                        {act.properties && act.action === 'paid' && (
                                            <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-2">
                                                <ShoppingCart size={14} className="text-green-500" />
                                                <span className="text-[11px] font-semibold text-gray-600">Payment Verified</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 opacity-40">
                            <Bell size={40} className="mb-2" />
                            <p className="text-sm">No activities yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Sub-component for XCircle which was missing from lucide imports
function XCircle({ size, ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
        </svg>
    );
}
