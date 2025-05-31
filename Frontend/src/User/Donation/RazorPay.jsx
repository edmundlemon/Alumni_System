import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function RazorPay() {
  const token = Cookies.get("token");
  const [amount, setAmount] = useState("");       // amount in SGD dollars// order ID from Razorpay
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isPaying,  setIsPaying]  = useState(false);

  /* ①  Load checkout.js once */
  useEffect(() => {
    const script = document.createElement("script");
    script.src   = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  /* ②  Click handler */
  const handlePayment = async () => {
    if (!amount || isNaN(amount)) {
      alert("Enter a valid amount (e.g. 5 or 12.50)");
      return;
    }

    if (!scriptLoaded) {
      alert("Gateway script still loading - try again in a moment.");
      return;
    }

    setIsPaying(true);

    try {
      // 🔥 Call your Laravel backend to create an order
      const response = await axios.post("http://localhost:8000/api/donations/create-donation/2", {
        amount: amount, // in SGD
        currency: "SGD"
      }).then((response) => {
        console.log("Order created successfully:", response.data);
        return response;
      }).catch((error) => {
        console.error("Error creating order:", error);
        alert("An error occurred. Please try again.");
        setIsPaying(false);
      });

      const { order_id, key, currency } = response.data;

      if (!order_id) {
        alert("Failed to create order. Please try again.");
        setIsPaying(false);
        return;
      }

      const options = {
        key: key, // from backend
        amount: amount * 100, // in subunits
        currency: currency || "SGD",
        name: "Donation",
        description: "Thank you for your support!",
        image: "https://example.com/your_logo",
        order_id: order_id,
        handler: async function (response) {
          alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
          setIsPaying(false);
          setAmount("");
          try {
            const paymentData = {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: amount*100,
            };

            await axios.post("http://localhost:8000/api/donations/verify-payment/2",paymentData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            alert("✅ Payment successful and recorded!");
            setAmount("");
          } catch (error) {
            console.error("❌ Failed to record payment:", error);
            alert("Payment was successful but failed to save. Contact support.");
          } finally {
            setIsPaying(false);
          }
        },
        prefill: {
          name: "John Doe",
          email: "hello@gmail.com"
        },
        notes: {
          address: "note value"
        },
        theme: {
          color: "#F37254"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsPaying(false);
    }
  };


  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Make Payment</h2>
      <input
        type="number"
        placeholder="Enter amount in SGD"
        className="w-full p-2 border rounded mb-4"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={handlePayment}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={!amount}
      >
        Pay S${amount || "0"}
      </button>
    </div>
  );
};

