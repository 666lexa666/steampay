import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';
import { PaymentData } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentData) => void;
  isLoading: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [steamLogin, setSteamLogin] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ steamLogin?: string; amount?: string }>({});
  
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

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

  const validateForm = () => {
    const newErrors: { steamLogin?: string; amount?: string } = {};
    
    if (!steamLogin.trim()) {
      newErrors.steamLogin = 'Введите корректный логин Steam.';
    }
    
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount < 100 || numAmount > 100000) {
      newErrors.amount = 'Сумма должна быть в пределах от 100 ₽ до 100 000 ₽.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        steamLogin: steamLogin.trim(),
        amount: Number(amount)
      });
    }
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    if (value === '' || /^\d+\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const numAmount = Number(amount) || 0;
  const toTopUp = Math.floor(numAmount * 0.9);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="relative bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6 w-full max-w-md transform transition-all scale-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 id="payment-modal-title" className="text-2xl font-bold text-white">
            Данные для пополнения
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Steam Login Field */}
          <div>
            <label htmlFor="steam-login" className="block text-sm font-medium text-gray-300 mb-2">
              Логин Steam
            </label>
            <input
              ref={firstInputRef}
              id="steam-login"
              type="text"
              value={steamLogin}
              onChange={(e) => setSteamLogin(e.target.value)}
              className={`w-full px-4 py-3 bg-gray-700 border ${
                errors.steamLogin ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors`}
              placeholder="Введите ваш логин Steam"
              aria-invalid={!!errors.steamLogin}
            />
            {errors.steamLogin && (
              <p className="text-red-400 text-sm mt-1">{errors.steamLogin}</p>
            )}
          </div>

          {/* Amount Field */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
              Сумма (₽)
            </label>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className={`w-full px-4 py-3 bg-gray-700 border ${
                errors.amount ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors`}
              placeholder="Введите сумму"
              aria-invalid={!!errors.amount}
            />
            <p className="text-gray-400 text-xs mt-1">
              Минимум 100 ₽, максимум 100 000 ₽. Комиссия 10% будет вычтена из указанной суммы.
            </p>
            {errors.amount && (
              <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Dynamic Calculation */}
          {numAmount > 0 && (
            <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-white">
                <span>К оплате:</span>
                <span className="font-bold">{numAmount} ₽</span>
              </div>
              <div className="flex justify-between text-cyan-300">
                <span>К пополнению Steam (после вычета комиссии 10%):</span>
                <span className="font-bold">{toTopUp} ₽</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading || !steamLogin.trim() || !amount || numAmount < 100 || numAmount > 100000}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg transition-all flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Обработка...</span>
                </>
              ) : (
                <span>Пополнить</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;