import { useState, useEffect } from "react";
import { CreditCard, Shield } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/payment.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    if (!location.state) {
      alert("Missing payment details. Redirecting...");
      navigate("/");
    } else {
      setPaymentData(location.state);
    }
  }, [location.state, navigate]);

  if (!paymentData) return <div className="payment-center">Loading payment details...</div>;

  const { event, formData, ticketCount, totals, bookingId } = paymentData;

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm 
        event={event} 
        formData={formData} 
        ticketCount={ticketCount} 
        totals={totals} 
        bookingId={bookingId} 
        navigate={navigate} 
      />
    </Elements>
  );
}

function PaymentForm({ event, totals,formData,ticketCount, bookingId, navigate }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error("Stripe is not ready. Please try again.");
      return;
    }
  
    setLoading(true);
  
    try {
      console.log("🔄 Sending payment request...", { amount: totals.total, bookingId });
  
      // Get client secret from backend
      const response = await axios.post(
        "http://https://eventure-backend-1ewk.onrender.com/api/payments/pay",
        { amount: totals.total, bookingId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
  
      console.log("📌 Booking ID Sent:", bookingId);
      console.log("📌 Payment Intent Response:", response.data);
  
      if (!response.data || !response.data.success || !response.data.clientSecret) {
        toast.error("Payment initialization failed. Please try again.");
        setLoading(false);
        return;
      }
  
      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(response.data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });
  
      if (result.error) {
        console.error("❌ Payment Failed:", result.error.message);
        toast.error("Payment Failed: " + result.error.message);
      } else {
        console.log("✅ Payment Successful:", result.paymentIntent);
        toast.success("Payment Successful! 🎉");
  
        // Redirect to Success page with relevant details
        navigate("/success", {
          state: { event, formData, ticketCount, totals, bookingId },
        });
      }
    } catch (error) {
      console.error("❌ Payment Error:", error.response?.data || error.message);
      toast.error("Payment Error! Please check your card details and try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="payment-gradient-background">
      <div className="payment-container">
        <div className="payment-form-container payment-glass-effect">
          <h2 className="payment-form-title">Payment Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="payment-form-group">
              <label className="payment-form-label">Card Details</label>
              <CardElement className="payment-premium-input" />
            </div>
            <div className="payment-secure-badge">
              <Shield size={16} />
              <span>Secure and encrypted payment</span>
            </div>
            <button type="submit" className="payment-premium-button" disabled={loading}>
              {loading ? "Processing..." : `Complete Payment (₹${totals.total})`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Payment;