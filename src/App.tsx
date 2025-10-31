import React, { useState } from 'react';
import Header from './components/Header';
import MainCard from './components/MainCard';
import Footer from './components/Footer';
import PaymentModal from './components/PaymentModal';
import QRModal from './components/QRModal';
import DocumentModal from './components/DocumentModal';
import Toast from './components/Toast';
import { PaymentData, PaymentResponse } from './types';

function App() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [documentType, setDocumentType] = useState<string>('');
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setIsLoading(false);
  };

  const handleOpenQRModal = () => {
    setIsQRModalOpen(true);
    setIsPaymentModalOpen(false);
  };

  const handleCloseQRModal = () => {
    setIsQRModalOpen(false);
    setPaymentData(null);
  };

  const handleOpenDocumentModal = (type: string) => {
    setDocumentType(type);
    setIsDocumentModalOpen(true);
  };

  const handleCloseDocumentModal = () => {
    setIsDocumentModalOpen(false);
    setDocumentType('');
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmitPayment = async (steamLogin: string, amount: number) => {
  setIsLoading(true);
  try {
    // Формируем payload для сервера
    const payload = {
      platform: 'steam',
      steamId: steamLogin,
      amount: amount,
    };

    console.log("Payload для сервера:", payload);

    const res = await fetch("/api/telega", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result: any = await res.json();

    if (!res.ok) {
      // обработка специфичной ошибки Steam
      if (result.error_code === -100) {
        alert("Неверный логин Steam");
      } else {
        alert(result.error || "Ошибка при создании заказа");
      }
      setIsLoading(false);
      return;
    }

    // успешный ответ
    setPaymentData(result.qrPayload ? result.qrPayload : result);
    setIsPaymentModalOpen(false);
    setIsQRModalOpen(true);

  } catch (err) {
    console.error(err);
    alert("Не удалось создать заказ");
    setIsLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Main background gaming image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="/images/phon.jpeg" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="min-h-screen bg-black/30 relative z-10">
        <Header />
        <MainCard onOpenPaymentModal={handleOpenPaymentModal} />
        <Footer onOpenDocumentModal={handleOpenDocumentModal} />
        
        {isPaymentModalOpen && (
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={handleClosePaymentModal}
            onSubmit={handleSubmitPayment}
            isLoading={isLoading}
          />
        )}
        
        {isQRModalOpen && paymentData && (
          <QRModal
            isOpen={isQRModalOpen}
            onClose={handleCloseQRModal}
            qrUrl={paymentData.qrUrl}
            paymentLink={paymentData.paymentLink}
          />
        )}
        
        {isDocumentModalOpen && (
          <DocumentModal
            isOpen={isDocumentModalOpen}
            onClose={handleCloseDocumentModal}
            documentType={documentType}
          />
        )}
        
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;