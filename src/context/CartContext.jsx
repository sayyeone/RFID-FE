import { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (plate) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item.rfid_uid === plate.rfid_uid);

            if (existingItem) {
                return prev.map(item =>
                    item.rfid_uid === plate.rfid_uid
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prev, { ...plate, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (rfidUid) => {
        setCartItems(prev => prev.filter(item => item.rfid_uid !== rfidUid));
    };

    const updateQuantity = (rfidUid, quantity) => {
        if (quantity <= 0) {
            removeFromCart(rfidUid);
            return;
        }

        setCartItems(prev =>
            prev.map(item =>
                item.rfid_uid === rfidUid ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotalItems,
            getTotalPrice
        }}>
            {children}
        </CartContext.Provider>
    )


}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
