import { NavLink } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import React from "react";


export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Your Cart</h2>

        {cart.length === 0 && (
          <p className="text-gray-500 text-center py-8">Your cart is currently empty.</p>
        )}

        {/* Container các item */}
        <div className="flex flex-wrap gap-4 mb-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-64 bg-white rounded-lg shadow p-4 flex flex-col items-center"
            >
              <div className="w-full h-40 mb-4">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              <h4 className="font-semibold text-lg text-center">{item.title}</h4>
              <p className="text-gray-600 mt-1">
                {Number(item.price).toLocaleString()}₫
              </p>

              <div className="flex items-center gap-2 mt-3">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, Number(e.target.value))
                  }
                  min="1"
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                />
                <div className="font-semibold text-gray-700">
                  {(Number(item.price) * Number(item.quantity)).toLocaleString()}₫
                </div>
              </div>

              <button
                className="mt-3 bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded transition"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Tổng tiền */}
        {cart.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 text-right">
            <h3 className="text-2xl font-bold mb-4">
              Total: {total.toLocaleString()}₫
            </h3>
            <NavLink to="/checkout" className="btn-primary px-6 py-3 rounded-lg font-semibold transition">
              Checkout
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}
