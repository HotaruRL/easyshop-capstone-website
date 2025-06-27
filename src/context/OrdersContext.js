import { createContext, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import axiosClient from "../api/axiosClient";

const OrdersContext = createContext(null);

export const OrdersProvider = ({ children }) => {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const placeOrder = useCallback(async () => {
    setIsPlacingOrder(true);
    setOrderError("");

    try {
      const response = await axiosClient.post("/orders");

      console.log("Order placed successfully:", response.data);

      clearCart();

      navigate(`/order-confirmation/${response.data.orderId}`);
    } catch (error) {
      console.error("Failed to place order:", error);
      setOrderError(
        "There was a problem placing your order. Please try again."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  }, [navigate, clearCart]);

  const contextValue = {
    isPlacingOrder,
    orderError,
    placeOrder,
  };

  return (
    <OrdersContext.Provider value={contextValue}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  return useContext(OrdersContext);
};
