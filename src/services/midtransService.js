// Midtrans Snap Service
let snapLoaded = false;
let snapLoadingPromise = null;

// Load Midtrans Snap script dynamically
const loadSnapScript = () => {
    if (snapLoadingPromise) return snapLoadingPromise;

    snapLoadingPromise = new Promise((resolve, reject) => {
        if (snapLoaded && window.snap) {
            resolve(window.snap);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');

        script.onload = () => {
            snapLoaded = true;
            resolve(window.snap);
        };

        script.onerror = () => {
            snapLoadingPromise = null;
            reject(new Error('Failed to load Midtrans Snap script'));
        };

        document.head.appendChild(script);
    });

    return snapLoadingPromise;
};

export const midtransService = {
    // Open Snap payment popup
    pay: async (snapToken, callbacks = {}) => {
        try {
            const snap = await loadSnapScript();

            snap.pay(snapToken, {
                onSuccess: (result) => {
                    console.log('Payment success:', result);
                    callbacks.onSuccess?.(result);
                },
                onPending: (result) => {
                    console.log('Payment pending:', result);
                    callbacks.onPending?.(result);
                },
                onError: (result) => {
                    console.error('Payment error:', result);
                    callbacks.onError?.(result);
                },
                onClose: () => {
                    console.log('Payment popup closed');
                    callbacks.onClose?.();
                }
            });
        } catch (error) {
            console.error('Midtrans service error:', error);
            callbacks.onError?.(error);
        }
    },
    /**
     * Check if Snap is loaded
     */
    isSnapLoaded: () => {
        return typeof window.snap !== 'undefined';
    }
};
