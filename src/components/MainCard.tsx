import React, { useState } from 'react';
import { CreditCard, HelpCircle } from 'lucide-react';

interface MainCardProps {
  onOpenPaymentModal: () => void;
}

const MainCard: React.FC<MainCardProps> = ({ onOpenPaymentModal }) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [showCommissionTooltip, setShowCommissionTooltip] = useState(false);

  return (
    <main id="main" className="relative container mx-auto px-4 py-12">
      {/* Background gaming image */}
      <div className="absolute inset-0 -z-10">
        <img 
          src="/images/MainCard1.jpg" 
          alt="" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-blue-900/80 to-purple-900/80"></div>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 shadow-2xl overflow-hidden">
          {/* Gaming accent elements */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <img 
              src="/images/MainCard2.jpg" 
              alt="" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <img 
                src="/images/Steam.svg.png" 
                alt="Steam gaming" 
                className="w-16 h-16 rounded-full border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/25"
              />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Пополнение Steam
            </h2>
           <p className="text-xl text-gray-300 leading-relaxed text-center">
            Пополнение <span className="text-white font-semibold">Steam</span> по&nbsp;
            <span className="text-white font-semibold">СБП</span> — 1 к 1.<br />
            Моментально. Безопасно. Без комиссии. <br />
            <span className="text-green-400 font-semibold">Комиссия 0%</span>.
          </p>
          </div>

          {/* Steam Top-Up Info */}
<div className="relative mb-8">
  <div className="bg-gradient-to-r from-green-500/20 to-green-700/20 border border-green-400/30 rounded-lg p-4 text-white font-semibold text-center shadow-md">
    Пополнение Steam аккаунта — 1 к 1, без комиссии
  </div>
</div>

          {/* Agreement Checkbox */}
          <div className="mb-8">
            <label className="flex items-start space-x-3 cursor-pointer group">
              <div className="relative flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  isAgreed 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 border-cyan-500' 
                    : 'border-gray-400 group-hover:border-cyan-400'
                }`}>
                  {isAgreed && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-gray-300 leading-relaxed">
                Я принимаю{' '}
                <button className="text-cyan-400 hover:text-cyan-300 underline transition-colors">
                  оферту
                </button>,{' '}
                <button className="text-cyan-400 hover:text-cyan-300 underline transition-colors">
                  Политику конфиденциальности
                </button>{' '}
                и даю согласие на обработку персональных данных.
              </span>
            </label>
          </div>

          {/* Pay Button */}
          <button
            onClick={onOpenPaymentModal}
            disabled={!isAgreed}
            className={`w-full py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center space-x-3 transition-all transform ${
              isAgreed
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white hover:scale-105 shadow-lg shadow-cyan-500/25'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            aria-disabled={!isAgreed}
          >
            <CreditCard className="h-6 w-6" />
            <span>Оплатить</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default MainCard;