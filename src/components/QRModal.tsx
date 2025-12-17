import React, { useEffect, useRef } from 'react';
import { X, Clock } from 'lucide-react';
import { QRCodeCanvas } from "qrcode.react";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrUrl: string;            // просто строка QR
  loading?: boolean;        // опциональный флаг загрузки
  modalError?: string;      // опциональная ошибка
}

const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, qrUrl, loading, modalError }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="relative bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6 w-full max-w-md transform transition-all scale-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
      >
        {/* Gaming background elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 opacity-5">
          <img 
            src="/images/QRModal.jpg" 
            alt="" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 id="qr-modal-title" className="text-2xl font-bold text-white">
            Оплата
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center space-y-6">
          {/* QR Code / Loading / Error */}
          <div className="bg-white p-4 rounded-xl inline-block">
            {loading ? (
              <p>Загрузка...</p>
            ) : modalError ? (
              <p className="text-red-400">{modalError}</p>
            ) : (
              <QRCodeCanvas
                value={qrUrl}
                size={192}          // 48 * 4 = ~192px
                bgColor="#ffffff"
                fgColor="#000000"
                includeMargin={false}
              />
            )}
          </div>

          {/* Instructions */}
          <p className="text-gray-300">Отсканируйте QR-код</p>

          {/* Timeout Warning */}
          <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-3 flex items-start space-x-2">
            <Clock className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-orange-300 text-sm">
              Если оплата не прошла за 15 минут — попробуйте создать платеж снова.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-lg transition-all transform hover:scale-105"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
