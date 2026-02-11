import { useState } from "react";
import { transactionApi } from "../api/transactionApi";
import { paymentApi } from "../api/paymentApi";
import { useCart } from "../context/CartContext";
import { midtransService } from "../services/midtransService";

export const useTransaction = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { cartItems, clearCart } = useCart();

    const createTransaction = async () => {
        if (cartItems.length === 0) {
            setError('Cart is empty');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Step 1: Create transaction
            const items = cartItems.map(item => ({
                plate_id: item.id,
                quantity: item.quantity,
                price: item.price
            }));
            
            const transactionResponse = await transactionApi.create({ items });
            const transaction = transactionResponse.data.data;

            // Step 2: Get Snap token
            const snapResponse = await paymentApi.createSnapToken(transaction.id);
            const snapToken = snapResponse.data.snap_token;

            // Step 3: Open Midtrans Snap
            return new Promise((resolve, reject) => {
                midtransService.openSnap(snapToken, {
                    onSuccess: (result) => {
                        clearCart();
                        resolve({ transaction, paymentResult: result });
                    },
                    onPending: (result) => {
                        clearCart();
                        resolve({ transaction, paymentResult: result, isPending: true });
                    },
                    onError: (result) => {
                        reject(new Error('Payment failed'));
                    },
                    onClose: () => {
                        // User closed popup without paying
                        console.log('Payment cancelled by user');
                    }
                });
            });

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Transaction failed';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createTransaction, loading, error };
}
