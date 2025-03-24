import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const alertTypes = {
  success: {
    icon: <CheckCircle className="text-green-500" />,
    bg: "bg-green-100",
    border: "border-green-500",
  },
  error: {
    icon: <XCircle className="text-red-500" />,
    bg: "bg-red-100",
    border: "border-red-500",
  },
  warning: {
    icon: <AlertTriangle className="text-yellow-500" />,
    bg: "bg-yellow-100",
    border: "border-yellow-500",
  },
  info: {
    icon: <Info className="text-blue-500" />,
    bg: "bg-blue-100",
    border: "border-blue-500",
  },
};

export default function Alert({
  type = "info",
  message,
  duration = 3000,
  onClose,
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-5 right-5 flex items-center gap-3 p-4 border-l-4 ${alertTypes[type].bg} ${alertTypes[type].border} rounded-lg shadow-lg animate-slide-in`}
    >
      {alertTypes[type].icon}
      <span className="text-gray-700 font-medium">{message}</span>
      <button onClick={() => setVisible(false)}>
        <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
      </button>
    </div>
  );
}
