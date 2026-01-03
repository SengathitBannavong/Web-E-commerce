import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { createCheckoutSession } from "../services/paymentService";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Vietnam",
    zipcode: "",
    paymentMethod: "cod"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      navigate("/cart");
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.Name || user.name || "",
        email: user.Email || user.email || "",
        phone: user.PhoneNumber || user.phone || "",
        address: user.Address || user.address || "",
      }));
    }
  }, [user, isAuthenticated, cart, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Prepare shipping address
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.country}`.trim();
      
      // For Stripe payment, redirect to Stripe checkout
      if (formData.paymentMethod === "stripe") {
        const stripeSession = await createCheckoutSession(shippingAddress);
        if (stripeSession && stripeSession.url) {
          // Redirect to Stripe checkout page
          window.location.href = stripeSession.url;
          return;
        } else {
          setError("Failed to create payment session. Please try again.");
          setLoading(false);
          return;
        }
      }

      // COD payment is not currently supported by the server API
      // The endpoint POST /orders/:userId does not exist
      // Users must use Stripe payment method
      setError("Cash on Delivery is not currently available. Please use Stripe payment.");
      setLoading(false);

    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                  <button onClick={() => navigate("/")} className="text-blue-500 hover:underline">Go back to shopping</button>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
      <div className="container max-w-screen-lg mx-auto">
        <div>
          <div className="mb-6">
            <h2 className="font-semibold text-xl text-gray-600 mb-2">Checkout</h2>
            <p className="text-gray-500 mb-2">Total Price: {total.toLocaleString()}₫</p>
            <p className="text-gray-500 mb-6">Items: {cart.length}</p>
          </div>

          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
            <form onSubmit={handleSubmit} className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8">
              <div className="text-gray-600">
                <p className="font-medium text-lg">Personal Details</p>
                <p>Please fill out all the fields.</p>
              </div>

              <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                  <div className="md:col-span-5">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="md:col-span-5">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly
                    />
                  </div>
                  <div className="md:col-span-5">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="md:col-spflex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="cod" 
                            checked={formData.paymentMethod === "cod"}
                            onChange={handleChange}
                            className="cursor-pointer"
                        />
                        <span>Cash On Delivery (COD)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="stripe" 
                          checked={formData.paymentMethod === "stripe"}
                          onChange={handleChange}
                          className="cursor-pointer"
                      />
                      <span className="flex items-center gap-2">
                          Pay with Stripe
                          <span className="text-xs text-gray-500">(Credit/Debit Card)</span>
                      </span> 
                    </label>
                  </div>
                  
                   <div className="md:col-span-5 mt-4">
                      <label className="font-semibold block mb-2">Payment Method</label>
                      <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2">
                              <input 
                                  type="radio" 
                                  name="paymentMethod" 
                                  value="cod" 
                                  checked={formData.paymentMethod === "cod"}
                                  onChange={handleChange}
                              />
                              Cash On Delivery (COD)
                          </label>
                      </div>
                  </div>


                  <div className="md:col-span-5 text-right mt-6">
                    <div className="inline-flex items-end">
                      {error && <p className="text-red-500 mr-4 mb-2">{error}</p>}
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                      >
                        {loading ? "Processing..." : formData.paymentMethod === "stripe" ? "Proceed to Payment" : "Place Order"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;