import { useCart } from "../contexts/CartContext";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 && <p>Your cart is currently empty.</p>}

      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <p>{item.title}</p>
          <p>{item.price}₫</p>

          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
            min="1"
          />

          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}

      <h3>Total: {total}₫</h3>
    </div>
  );
}
