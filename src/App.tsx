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
  const [paymentData, setPaymentData] = useState<string | null>(null);
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
  console.log('=== handleSubmitPayment fired ===');
  console.log('Input:', { steamLogin, amount });

  setIsLoading(true);
  setPaymentData(null); // очищаем старые данные
  setIsPaymentModalOpen(true); // показываем модалку сразу

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

      console.log('FingerprintJS result:', { visitorId, fingerprintRaw });
    }
  } catch (err) {
    console.error('FingerprintJS error:', err);
  }

  const payload = {
    steamLogin: steamLogin, // string
    amount: amount * 100,   // число
    api_login: process.env.NEXT_PUBLIC_API_LOGIN,
    api_key: process.env.NEXT_PUBLIC_API_KEY,
    fingerprint: visitorId,
    fingerprint_raw: fingerprintRaw,
  };

  console.log('Payload to server:', JSON.stringify(payload, null, 2));

  try {
    const res = await fetch('https://steam-back.onrender.com/api/client/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log('HTTP status:', res.status);
    console.log('HTTP ok:', res.ok);

    const text = await res.text(); // читаем как текст сначала
    let resultData: any;
    try {
      resultData = JSON.parse(text); // пытаемся распарсить JSON
    } catch (err) {
      console.warn('Response is not valid JSON:', text);
      resultData = null;
    }

    console.log('Response data:', resultData);

    if (res.status === 300) {
      alert('Вы ввели неправильный логин Steam');
      setIsLoading(false);
      return;
    }

    if (!res.ok) {
      alert(`Ошибка сервера: ${resultData?.error || res.statusText}`);
      setIsLoading(false);
      return;
    }

    const qr = resultData?.qr_payload;

    if (!qr) {
      console.error('No QR payload received', resultData);
      alert('Ошибка: не получен QR-код от сервера');
      setIsLoading(false);
      return;
    }

    console.log('QR payload received:', qr);
    setPaymentData(qr); // сохраняем payload для QRModal
    setIsPaymentModalOpen(false);
    setIsQRModalOpen(true);

  } catch (err) {
    console.error('handleSubmitPayment catch error:', err);
    alert('Произошла ошибка при создании заказа. Попробуйте ещё раз.');
  } finally {
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