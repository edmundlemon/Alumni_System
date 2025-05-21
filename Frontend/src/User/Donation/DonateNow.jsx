import { useState } from "react";
import { MdAttachMoney } from "react-icons/md";
import { IoClose } from "react-icons/io5";

export default function DonateNow({ donate, onClose }) {
  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      maximumFractionDigits: 0,
    }).format(amt);

  const calcProgress = (raised, goal) =>
    Math.min(Math.round((raised / goal) * 100), 100);

  const progress = calcProgress(donate.raised, donate.goal);

  const preset = [50, 100, 150, 200, 250, 300];
  const [chosen, setChosen] = useState(null);
  const [custom, setCustom] = useState("");

  const choose = (val) => {
    setChosen(val);
    setCustom("");
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl relative w-[520px] transition-all">
      <IoClose
        onClick={onClose}
        className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-red-500 transition"
        size={24}
      />

      <h1 className="text-2xl font-bold text-gray-800 mt-1">{donate.name}</h1>

      

      {/* Description */}
      <p className="mt-2 text-sm leading-relaxed text-gray-700">
        {donate.description}
      </p>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
          <span>Raised {formatCurrency(donate.raised)}</span>
          <span>Goal {formatCurrency(donate.goal)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 rounded-full transition-all duration-700 ${
              progress >= 100 ? "bg-green-500" : "bg-indigo-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right mt-1 text-xs text-gray-500 font-medium">
          {progress}% funded
        </p>
      </div>

      {/* Amount Selection */}
      <div className="mt-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          Select Amount
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {preset.map((val) => (
            <button
              key={val}
              type="button"
              aria-pressed={chosen === val}
              onClick={() => choose(val)}
              className={`py-2 rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  chosen === val
                    ? "bg-indigo-600 text-white ring-2 ring-indigo-400"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {formatCurrency(val)}
            </button>
          ))}
        </div>

        {/* Custom Input */}
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
            className="w-full pl-10 pr-14 h-11 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            MYR
          </span>
        </div>

        {/* Donate Button */}
        <button
          className="mt-6 w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          disabled={!chosen && !custom}
        >
          Donate{" "}
          {chosen
            ? formatCurrency(chosen)
            : custom
            ? formatCurrency(custom)
            : ""}
        </button>
      </div>
    </div>
  );
}
