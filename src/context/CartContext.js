import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axiosClient from "../api/axiosClient";

const CartContext = createContext({
    cartItems: [],
    cartItemCount: 0,
    addToCart: () => {},
    increaseQuantity: () => {},
    decreaseQuantity: () => {},
    removeFromCart: () => {},
    clearCart: () => {},
});

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const fetchCart = async () => {
                try {
                    const response = await axiosClient.get("/cart");
                    if (response.data && Array.isArray(response.data.items)) {
                        setCartItems(response.data.items);
                    } else {
                        setCartItems([]);
                    }
                } catch (error) {
                    console.error("Failed to fetch cart:", error);
                    setCartItems([]);
                }
            };
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [user]);

    const addToCart = async (product) => {
        try {
            const response = await axiosClient.post(`/cart/products/${product.productId}`);
            if (response.data && Array.isArray(response.data.items)) {
                setCartItems(response.data.items);
            }
        } catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            const response = await axiosClient.put(`/cart/products/${productId}`, { quantity: newQuantity });
            if (response.data && Array.isArray(response.data.items)) {
                setCartItems(response.data.items);
            }
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };

    const increaseQuantity = (productId) => {
        // Find the item by looking inside the nested product object.
        const item = cartItems.find((i) => Number(i.product.productId) === Number(productId));
        if (item) {
            updateQuantity(productId, item.quantity + 1);
        }
    };

    const decreaseQuantity = (productId) => {
        const item = cartItems.find((i) => Number(i.product.productId) === Number(productId));
        if (item) {
            if (item.quantity > 1) {
                updateQuantity(productId, item.quantity - 1);
            } else {
                removeFromCart(productId);
            }
        }
    };

    const removeFromCart = (productId) => {
        updateQuantity(productId, 0);
    };

    const clearCart = async () => {
        try {
            console.log("Clearing entire cart from database...");

            const response = await axiosClient.delete("/cart");

            if (response.data && Array.isArray(response.data.items)) {
                setCartItems(response.data.items);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Failed to clear cart:", error);
        }
    };


    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const contextValue = {
        cartItems,
        cartItemCount,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
    };

    return (
        <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};