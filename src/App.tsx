import React, { useState, useEffect } from 'react';

import Header from './components/Header';
import MainCard from './components/MainCard';
import Footer from './components/Footer';
import PaymentModal from './components/PaymentModal';
import QRModal from './components/QRModal';
import DocumentModal from './components/DocumentModal';
import Toast from './components/Toast';
import { PaymentData, PaymentResponse } from './types';

import TechPage from "./components/TechPage";
import { getTechStatus } from "./utils/getTechStatus";

function App() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [documentType, setDocumentType] = useState<string>('');
  const [paymentData, setPaymentData] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // === TECH MODE (SUPABASE) ===
  const [isTech, setIsTech] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const status = await getTechStatus();
      setIsTech(status);
    };

    check();
    const interval = setInterval(check, 5000);

    return () => clearInterval(interval);
  }, []);

  // Если техработы — показываем только TechPage
  if (isTech) {
    return <TechPage />;
  }
  // ========== END TECH MODE ==========


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

  const handleSubmitPayment = async (data: { steamLogin: string; amount: number }) => {
    console.log('handleSubmitPayment fired', data);
  
    setPaymentData(null);
    setIsPaymentModalOpen(true);
    setIsLoading(true);
  
    let visitorId = 'unknown';
    let fingerprintRaw: any = null;
  
    try {
      if (typeof window !== 'undefined') {
        const FingerprintJSModule = await import('@fingerprintjs/fingerprintjs');
        const FingerprintJS = (FingerprintJSModule.default || FingerprintJSModule) as any;
  
        const fpInstance = await FingerprintJS.load();
        const result = await fpInstance.get();
  
        visitorId = result?.visitorId ?? 'unknown';
        fingerprintRaw = result?.components ?? null;
  
        console.log('FP result', { visitorId, fingerprintRaw });
      }
    } catch (err) {
      console.error('FingerprintJS error:', err);
    }
  
    const payload = {
      steamLogin: data.steamLogin,
      amount: data.amount * 100,
      api_login: process.env.NEXT_PUBLIC_API_LOGIN,
      api_key: process.env.NEXT_PUBLIC_API_KEY,
      fingerprint: visitorId,
      fingerprint_raw: fingerprintRaw,
    };
  
    console.log('Payload to server:', payload);
  
    try {
      const res = await fetch('https://steampay-back.onrender.com/api/client/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      console.log('Server response status:', res.status);
  
      let responseBody: any = null;
      try {
        responseBody = await res.json();
      } catch (err) {
        console.error('Ошибка парсинга тела ответа от сервера:', err);
        responseBody = await res.text();
      }
  
      console.log('Server response body:', responseBody);
  
      if (res.status === 422 || responseBody?.code === -100) {
        setToast({
          message: '❌ Вы ввели неправильный логин Steam',
          type: 'error',
        });
        setIsLoading(false);
        return;
      }
  
      if (!res.ok) {
        setToast({
          message: `Ошибка сервера: ${responseBody?.error || res.statusText}`,
          type: 'error',
        });
        setIsPaymentModalOpen(false);
        setIsLoading(false);
        return;
      }
  
      const qr = responseBody.qr_payload;
      if (!qr) {
        setToast({
          message: 'Ошибка: не получен QR-код от сервера',
          type: 'error',
        });
        setIsPaymentModalOpen(false);
        setIsLoading(false);
        return;
      }
  
      setPaymentData(qr);
      setIsPaymentModalOpen(false);
      setIsQRModalOpen(true);
  
    } catch (err) {
      console.error('handleSubmitPayment error:', err);
      setToast({
        message: 'Произошла ошибка при создании заказа. Попробуйте ещё раз.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      
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
        
        {isQRModalOpen && (
          <QRModal
            isOpen={isQRModalOpen}
            onClose={handleCloseQRModal}
            qrUrl={paymentData || ''}
            loading={isLoading}
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
