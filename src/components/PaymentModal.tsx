import { Loader2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
}

export function PaymentModal({ isOpen }: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="bg-gray-900 border-2 border-cyan-500/30 rounded-lg p-8 shadow-2xl shadow-cyan-500/20 text-center">
        <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
        <p className="text-xl text-white font-semibold">Обработка платежа...</p>
        <p className="text-gray-400 mt-2">Пожалуйста, подождите</p>
      </div>
    </div>
  );
}
