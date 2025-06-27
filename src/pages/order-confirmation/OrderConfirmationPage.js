import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "./OrderConfirmationPage.css";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosClient.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (loading)
    return (
      <div className="loading-message">Loading your order confirmation...</div>
    );
  if (!order)
    return <div className="error-message">Could not find your order.</div>;

  // Calculate the subtotal from the line items
  const subtotal = order.lineItems.reduce(
    (total, item) => total + item.salePrice * item.quantity,
    0
  );

  return (
    <div className="confirmation-container">
      <div className="icon-wrapper">
        <div className="success-icon"></div>
      </div>

      <h2>Thank You, {order.firstName}!</h2>
      <p className="confirmation-message">
        Your order has been placed successfully.
      </p>

      <div className="order-details-summary">
        <h4>Order Summary (ID: {order.orderId})</h4>
        {order.lineItems.map((item) => (
          <div key={item.productId} className="summary-item">
            <span>
              {item.productName || `Product ID: ${item.productId}`} (x
              {item.quantity})
            </span>
            <span>${(item.salePrice * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-total">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-total">
          <span>Shipping</span>
          <span>${order.shippingAmount.toFixed(2)}</span>
        </div>
        <div className="summary-total grand-total">
          <span>Grand Total</span>
          <span>${(subtotal + order.shippingAmount).toFixed(2)}</span>
        </div>
      </div>

      <Link to="/" className="continue-shopping-btn">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderConfirmationPage;
