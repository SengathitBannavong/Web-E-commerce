import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import "./PaymentSuccess.css";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        // Show success message for 2 seconds for processing simulation
        setTimeout(() => {
          setProcessing(false);
        }, 2000);

        setTimeout(() => {
          navigate("/account?tab=orders");
        }, 4000); // Increased to 4s to let user read the success message
      } catch (error) {
        console.error("Error processing payment success:", error);
        setProcessing(false);
      }
    };

    handlePaymentSuccess();
  }, [clearCart, navigate]);

  return (
    <div className="payment-success-page">
      <div className="success-card">
        {processing ? (
          <>
            <div className="status-icon-wrapper">
              <div className="status-icon status-icon--processing">
                <svg
                  className="icon-processing"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="success-title">Processing Payment...</h2>
            <p className="success-message">Please wait while we confirm your payment.</p>
          </>
        ) : (
          <>
            <div className="status-icon-wrapper">
              <div className="status-icon status-icon--success">
                <svg
                  className="icon-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="success-title">Payment Successful!</h2>
            <p className="success-message">
              Your order has been placed successfully. You will be redirected to your account page.
            </p>
            <button
              onClick={() => navigate("/account?tab=orders")}
              className="btn btn-success"
            >
              View Orders
            </button>
          </>
        )}
      </div>
    </div>
  );
}

