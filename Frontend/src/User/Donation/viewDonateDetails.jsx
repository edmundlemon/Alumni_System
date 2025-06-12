import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdAttachMoney } from "react-icons/md";
import { IoReturnUpBackSharp } from "react-icons/io5";
import axios from "axios";
import Cookies from "js-cookie";
import fallbackImage from '../../assets/fallback-image.jpg';

export default function ViewDonateDetails() {
  const { state } = useLocation();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const userName = Cookies.get("userName");
  const email = Cookies.get("email");

  const dnt = state?.dnt;
  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      maximumFractionDigits: 0,
    }).format(amt);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const preset = [50, 100, 150, 200, 250, 300];
  const [chosen, setChosen] = useState(null);
  const [custom, setCustom] = useState("");
  const amount = chosen ? chosen : custom ? Number(custom) : null;

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
      const response = await axios
        .post("http://localhost:8000/api/donations/create-donation/2", {
          amount: amount, // in SGD
          currency: "SGD",
        })
        .then((response) => {
          console.log("Order created successfully:", response.data);
          return response;
        })
        .catch((error) => {
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
          alert(
            "Payment successful! Payment ID: " + response.razorpay_payment_id
          );
          setIsPaying(false);
          setCustom("");
          setChosen(null);
          try {
            const paymentData = {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: amount * 100,
            };

            await axios.post(
              "http://localhost:8000/api/donations/verify-payment/2",
              paymentData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            alert("✅ Payment successful and recorded!");
              setCustom("");
              setChosen(null);  
          } catch (error) {
            console.error("❌ Failed to record payment:", error);
            alert(
              "Payment was successful but failed to save. Contact support."
            );
          } finally {
            setIsPaying(false);
          }
        },
        prefill: {
          name: userName,
          email: email,
        },
        notes: {
          address: "note value",
        },
        theme: {
          color: "#1560bd",
        },
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

  const calcProgress = (raised, goal) =>
    Math.min(Math.round((raised / goal) * 100), 100);

  const progress = calcProgress(dnt.current_amount, dnt.target_amount);

  /* ---------- pick‑an‑amount state ---------- */
  const choose = (val) => {
    setChosen(val);
    setCustom("");
  };
  return (
    <section className="min-h-screen py-5 px-4">
      <button
        className=" ml-[106px] flex items-center rounded p-2 text-white bg-denim font-medium mb-4 gap-2 text-sm"
        onClick={() => window.history.back()}
      >
        <IoReturnUpBackSharp size={18} />
        Back to Donations
      </button>
      <div className="mx-auto max-w-7xl border bg-white/60 backdrop-blur shadow rounded-xl overflow-hidden lg:flex">
        <div className="flex-1 p-8 flex flex-col">
          <h1 className="text-4xl font-extrabold text-gray-800">{dnt.name}</h1>

          <div className="mt-6">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>Raised&nbsp;{formatCurrency(dnt.current_amount)}</span>
              <span>Goal&nbsp;{formatCurrency(dnt.target_amount)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={
                  `h-4 rounded-full transition-all duration-700 ` +
                  (progress >= 100 ? "bg-green-500" : "bg-denim")
                }
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-right mt-1 text-sm font-medium text-gray-500">
              {progress}% funded
            </p>
          </div>

          <p className="mt-6 leading-relaxed text-gray-600">
            {dnt.description}
          </p>

          <div className="mt-auto">
            <h2 className="sr-only">Choose amount</h2>
            <div className="grid grid-cols-3 gap-3 mt-8">
              {preset.map((val) => (
                <button
                  key={val}
                  type="button"
                  aria-pressed={chosen === val}
                  onClick={() => choose(val)}
                  className={`py-2 rounded-lg text-center text-sm font-medium transition 
                    ${
                      chosen === val
                        ? "bg-denim text-white ring-2 ring-denim/50"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {formatCurrency(val)}
                </button>
              ))}
            </div>

            <div className="relative mt-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <MdAttachMoney size={22} />
              </span>
              <input
                type="number"
                min="1"
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value);
                  setChosen(null);
                }}
                placeholder="Custom amount"
                className="w-full pl-10 pr-14 h-11 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring focus:ring-denim/30"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                MYR
              </span>
            </div>

            <button
              onClick={handlePayment}
              className="mt-5 w-full h-11 bg-denim hover:bg-denim/90 text-white font-semibold rounded-lg transition"
            >
              Donate&nbsp;
              {chosen
                ? formatCurrency(chosen)
                : custom
                ? formatCurrency(custom)
                : ""}
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          <img
            src={dnt.image ? dnt.image : fallbackImage}
            alt={`${dnt.name} visual`}
            className="object-cover w-full h-72 lg:h-full"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>
    </section>
  );
}
