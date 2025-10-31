import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 transform transition-all duration-300">
      <div className={`flex items-center space-x-3 p-4 rounded-lg shadow-lg border ${
        type === 'success'
          ? 'bg-green-500/90 border-green-400 text-white'
          : 'bg-red-500/90 border-red-400 text-white'
      }`}>
        {type === 'success' ? (
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
        ) : (
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
        )}
        <p className="font-medium">{message}</p>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;