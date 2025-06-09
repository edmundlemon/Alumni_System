import { useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { MdClose } from "react-icons/md";

export default function CustomToast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: {
      container: "bg-green-100 border-l-4 border-green-500 text-green-700",
      icon: <FaCheckCircle className="text-green-500 text-xl" />,
    },
    error: {
      container: "bg-red-100 border-l-4 border-red-500 text-red-700",
      icon: <FaTimesCircle className="text-red-500 text-xl" />,
    },
  };

  const current = styles[type] || styles.success;

  return (
    <div className={`flex items-start gap-3 max-w-sm px-4 py-3 rounded shadow-md fixed top-6 right-6 z-[9999] ${current.container}`}>
      <div className="mt-[2px]">{current.icon}</div>
      <div className="flex-1">
        <p className="font-semibold capitalize">{type}!</p>
        <p className="text-sm">{message}</p>
      </div>
      <button onClick={onClose} className="text-xl text-gray-600 hover:text-black">
        <MdClose />
      </button>
    </div>
  );
}
