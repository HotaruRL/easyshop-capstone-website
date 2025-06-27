import { useState, useEffect } from 'react';
import { useOrders } from '../../context/OrdersContext';
import { useCart } from '../../context/CartContext';
import axiosClient from '../../api/axiosClient';
import './CheckoutPage.css';

const CheckoutPage = () => {

    const { placeOrder, isPlacingOrder, orderError } = useOrders();
    const { cartItems } = useCart();
    
    //  fetch the profile to show the user their shipping address for confirmation.
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosClient.get('/profile');
                setProfile(response.data);
            } catch (err) {
                console.error("Failed to fetch profile for checkout:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // The subtotal is the only price we can show before placing the order.
    const subtotal = cartItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);

    if (loading) return <div className="loading-message">Loading your details...</div>;

    return (
        <div className="checkout-container">
            <div className="checkout-card">
                <h2>Review Your Order</h2>
                <div className="checkout-details-grid">
                    <div className="detail-section">
                        <h3>Shipping To:</h3>
                        {profile ? (
                            <div className="address-details">
                                <p><strong>{profile.firstName} {profile.lastName}</strong></p>
                                <p>{profile.address}</p>
                                <p>{profile.city}, {profile.state} {profile.zip}</p>
                            </div>
                        ) : <p>Could not load shipping address.</p>}
                    </div>

                    <div className="detail-section">
                        <h3>Order Summary</h3>
                        <div className="order-summary-items">
                            {cartItems.map(item => (
                                <div key={item.product.productId} className="summary-item">
                                    <span>{item.product.name} (x{item.quantity})</span>
                                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-total">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <p className="shipping-note">Shipping will be calculated at the final step.</p>
                    </div>
                </div>
                
                <button 
                    onClick={placeOrder} 
                    disabled={isPlacingOrder || cartItems.length === 0}
                    className="place-order-btn"
                >
                    {isPlacingOrder ? 'Placing Order...' : 'Place Your Order'}
                </button>
                {orderError && <p className="error-message">{orderError}</p>}
            </div>
        </div>
    );
};

export default CheckoutPage;