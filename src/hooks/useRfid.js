import { useState } from "react";
import { plateApi } from "../api/plateApi";
import { useCart } from "../context/CartContext";

export const useRfid = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    const scanRfid = async (rfid_uid) => {
        if (!rfid_uid || rfid_uid.trim() === '') {
            setError('Please enter RFID UID');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await plateApi.getByRfid(rfid_uid);
            const plate = response.data.data;

            if (!plate.is_active) {
                setError('This plate is inactive');
                return;
            }

            addToCart(plate);
            return plate;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Plate not found';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    return { scanRfid, loading, error, setError};
};