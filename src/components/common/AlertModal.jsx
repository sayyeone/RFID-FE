import { X, CheckCircle, AlertCircle, Info, HelpCircle } from 'lucide-react';

export default function AlertModal({
    isOpen,
    onClose,
    title,
    message,
    type = 'info', // success, error, info, warning, confirm
    onConfirm,
    confirmText = 'OK',
    cancelText = 'Cancel'
}) {
    if (!isOpen) return null;

    const typeConfig = {
        success: {
            icon: <CheckCircle className="text-green-500" size={48} />,
            btnColor: 'bg-green-500 hover:bg-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-100'
        },
        error: {
            icon: <AlertCircle className="text-red-500" size={48} />,
            btnColor: 'bg-red-500 hover:bg-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-100'
        },
        warning: {
            icon: <Info className="text-orange-500" size={48} />,
            btnColor: 'bg-orange-500 hover:bg-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-100'
        },
        confirm: {
            icon: <HelpCircle className="text-blue-500" size={48} />,
            btnColor: 'bg-primary hover:bg-[#5f61e6]',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-100'
        },
        info: {
            icon: <Info className="text-blue-500" size={48} />,
            btnColor: 'bg-blue-500 hover:bg-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-100'
        }
    };

    const config = typeConfig[type] || typeConfig.info;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 transition-all animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
                <div className={`p-8 flex flex-col items-center text-center ${config.bgColor} border-b ${config.borderColor}`}>
                    <div className="mb-4">
                        {config.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
                </div>

                <div className="p-4 bg-white flex items-center justify-center gap-3">
                    {type === 'confirm' && (
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (onConfirm) onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-4 py-2.5 text-white font-semibold rounded-xl transition-all shadow-md ${config.btnColor}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
