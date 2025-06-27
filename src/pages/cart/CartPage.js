import { useCart } from "../../context/CartContext";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";

const getImageUrl = (item) => {
  // Check if item, item.product, and item.product.imageUrl all exist and is a string
  if (
    item &&
    item.product &&
    item.product.imageUrl &&
    typeof item.product.imageUrl === "string"
  ) {
    const url = item.product.imageUrl;
    if (url.startsWith("http")) {
      return url;
    } else {
      // It's a local filename, construct the path from public folder
      return `/images/products/${url}`;
    }
  }
  // Fallback to a placeholder image if imageUrl is missing or invalid
  return "/images/placeholder.jpeg";
};

const CartPage = () => {
  const navigate = useNavigate();
  // get functions from the cart context
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  // calculate the total price
  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.product?.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return total + price * quantity;
  }, 0);

  const handleImageError = (event) => {
    event.target.onerror = null;
    event.target.src = "/images/placeholder.jpeg";
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      <div className="cart-items-list">
        {cartItems.map((item) => (
          <div key={item.product.productId} className="cart-item">
            <img
              src={getImageUrl(item)}
              alt={item.name}
              className="cart-item-image"
              onError={handleImageError}
            />

            <div className="cart-item-info">
              <h3>{item.product.name}</h3>
              {/* Access name from nested product */}
              <p>${item.product.price.toFixed(2)}</p>
              {/* Access price from nested product */}
              <button
                className="remove-item-btn"
                onClick={() => removeFromCart(item.product.productId)}
              >
                Remove
              </button>
            </div>

            <div className="cart-item-controls">
              <button onClick={() => decreaseQuantity(item.product.productId)}>
                -
              </button>
              <span>Quantity: {item.quantity}</span>
              <button onClick={() => increaseQuantity(item.product.productId)}>
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-actions">
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-summary">
          <div className="total-row">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Shipping</span>
            <span> will be calculated at the final step</span>
          </div>
          <div className="total-row grand-total">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
