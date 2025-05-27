import { useLocation } from "react-router-dom";
import { useState } from "react";
import { MdAttachMoney } from "react-icons/md";
import { IoReturnUpBackSharp } from "react-icons/io5";

export default function ViewDonateDetails() {
  const { state } = useLocation();
  const dnt = state?.dnt;
  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      maximumFractionDigits: 0,
    }).format(amt);

  const calcProgress = (raised, goal) =>
    Math.min(Math.round((raised / goal) * 100), 100);

  const progress = calcProgress(dnt.raised, dnt.goal);

  /* ---------- pick‑an‑amount state ---------- */
  const preset = [50, 100, 150, 200, 250, 300];
  const [chosen, setChosen] = useState(null);
  const [custom, setCustom] = useState("");

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
              <span>Raised&nbsp;{formatCurrency(dnt.raised)}</span>
              <span>Goal&nbsp;{formatCurrency(dnt.goal)}</span>
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

            <button className="mt-5 w-full h-11 bg-denim hover:bg-denim/90 text-white font-semibold rounded-lg transition">
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
            src={dnt.image}
            alt={`${dnt.name} visual`}
            className="object-cover w-full h-72 lg:h-full"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>
    </section>
  );
}
