import { useState, useEffect } from "react";

const RazorPay = () => {
  const [amount, setAmount] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Correct Razorpay script URL
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js"; // Fixed URL
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!scriptLoaded) {
      alert("Payment gateway is still loading. Please try again in a moment.");
      return;
    }

    const options = {
      key: "rzp_test_sg_U8RyXx7hpnC7uv", // Replace with your test key
      amount: Number(amount) * 100, // Convert to paise
      currency: "INR",
      name: "STARTUP_PROJECTS",
      description: "Test Transaction",
      handler: function(response) {
        alert(`Payment successful! ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Make Payment</h2>
      <input
        type="number"
        placeholder="Enter amount in INR"
        className="w-full p-2 border rounded mb-4"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={handlePayment}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={!amount}
      >
        Pay ₹{amount || "0"}
      </button>
    </div>
  );
};

export default RazorPay; // Make sure this export exists