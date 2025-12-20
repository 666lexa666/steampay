import { useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'error' | 'success';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-900/90' : 'bg-green-900/90';
  const borderColor = type === 'error' ? 'border-red-500' : 'border-green-500';
  const Icon = type === 'error' ? AlertCircle : CheckCircle;

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${bgColor} ${borderColor} border-2 rounded-lg p-4 shadow-lg shadow-black/50 animate-slideIn flex items-center gap-3 min-w-[300px] max-w-md`}
    >
      <Icon className={type === 'error' ? 'text-red-400' : 'text-green-400'} size={24} />
      <p className="flex-1 text-white">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  );
}
