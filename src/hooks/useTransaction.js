import { useState } from "react";
import { transactionApi } from "../api/transactionApi";
import { useCart } from "../context/CartContext";

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
            const items = cartItems.map(item => ({
                plate_id: item.id,
                quantity: item.quantity,
                price: item.price
            }));
            const response = await transactionApi.create({ items });
            const transaction = response.data.data;
            clearCart();
            return transaction;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Transaction failed';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    return { createTransaction, loading, error };
}