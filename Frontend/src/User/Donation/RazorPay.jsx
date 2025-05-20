import { useState, useEffect } from "react";

export default function RazorPay() {
  const [amount, setAmount] = useState("");       // amount in SGD dollars
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
      /* ②‑A  Ask your Laravel backend to create the order */
      const res = await fetch("http://localhost:8000/api/donations/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),   // SGD, not ×100
      });
      console.log(res);
      if (!res.ok) {
        throw new Error("Server error while creating order");
      }

      const { key, orderId, amountCents } = await res.json(); // ← comes from PHP

      /* ②‑B  Open Razorpay Checkout **with that order** */
      const rzp = new window.Razorpay({
        key,                              // still the TEST key
        order_id: orderId,                // critical line
        amount:   amountCents,            // only for display
        currency: "SGD",
        name: "STARTUP_PROJECTS",
        description: "Test Donation",
        handler: async function (resp) {
          /* ②‑C  Tell backend to verify the payment */
          const ok = await fetch("http://localhost:8000/api/donations/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resp),   // { razorpay_payment_id, razorpay_order_id, razorpay_signature }
          });

          if (ok.ok) {
            alert("Payment successful! ID: " + resp.razorpay_payment_id);
            setAmount("");
          } else {
            alert("Payment captured but verification failed on server.");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to start payment");
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

