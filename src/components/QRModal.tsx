import { X } from 'lucide-react';
import { useEffect } from 'react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrData: string | null;
}

export function QRModal({ isOpen, onClose, qrData }: QRModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !qrData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="bg-gray-900 border-2 border-cyan-500/30 rounded-lg w-full max-w-md shadow-2xl shadow-cyan-500/20 animate-fadeIn">
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/30 bg-gradient-to-r from-gray-800 to-gray-900">
          <h2 className="text-xl font-bold text-cyan-400">Оплата заказа</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray-300 mb-4">Отсканируйте QR-код для оплаты</p>
          <div className="bg-white p-4 rounded-lg inline-block">
            <img
              src={qrData}
              alt="QR Code"
              className="w-64 h-64 mx-auto"
            />
          </div>
          <p className="text-gray-400 text-sm mt-4">
            После оплаты средства будут зачислены на ваш Steam кошелек в течение 5-15 минут
          </p>
        </div>
      </div>
    </div>
  );
}
