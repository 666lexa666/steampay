import { useState } from 'react';
import { Gamepad2, FileText, Shield, UserCheck, XCircle } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';
import { PaymentModal } from '../components/PaymentModal';
import { QRModal } from '../components/QRModal';
import {
  OfferDocument,
  PrivacyPolicyDocument,
  PersonalDataConsentDocument,
  ServiceRefusalDocument,
} from '../components/Documents';

interface ToastState {
  message: string;
  type: 'error' | 'success';
}

export function HomePage() {
  const [steamLogin, setSteamLogin] = useState('');
  const [amount, setAmount] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!steamLogin || !amount) {
      setToast({
        message: 'Пожалуйста, заполните все поля',
        type: 'error',
      });
      return;
    }
  
    if (!isAgreed) {
      setToast({
        message: 'Необходимо принять условия оферты',
        type: 'error',
      });
      return;
    }
  
    const amountNum = Number(amount);
  
    if (!Number.isFinite(amountNum)) {
      setToast({
        message: 'Введите корректную сумму',
        type: 'error',
      });
      return;
    }
  
    // 🔥 ВОТ ТУТ ЛИМИТЫ, ПРОСТО И ЖЁСТКО
    if (amountNum < 100) {
      setToast({
        message: 'Минимальная сумма пополнения — 100 ₽',
        type: 'error',
      });
      return;
    }
  
    if (amountNum > 30000) {
      setToast({
        message: 'Максимальная сумма пополнения — 30 000 ₽',
        type: 'error',
      });
      return;
    }
  
    // ✅ если всё ок — идём дальше
    await handleSubmitPayment({ steamLogin, amount: amountNum });
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
      api_login: import.meta.env.VITE_API_LOGIN,
      api_key: import.meta.env.VITE_API_KEY,
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
          message: 'Вы ввели неправильный логин Steam',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black relative overflow-hidden">
      <div className="absolute inset-0"></div>
      <div className="absolute inset-0"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-12 h-12 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              TOR <span className="text-cyan-400">PAYMENTS</span>
            </h1>
          </div>
          <p className="text-gray-300 text-lg">Пополнение кошелька Steam</p>
        </header>

        <main className="max-w-md mx-auto">
          <div className="bg-gray-900/80 border-2 border-cyan-500/30 rounded-2xl p-8 shadow-none">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Форма пополнения
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="steamLogin" className="block text-sm font-medium text-gray-300 mb-2">
                  Логин Steam
                </label>
                <input
                  type="text"
                  id="steamLogin"
                  value={steamLogin}
                  onChange={(e) => setSteamLogin(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-0"
                  placeholder="Введите ваш логин Steam"
                  required
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                  Сумма пополнения (₽)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-0"
                  placeholder="Введите сумму"
                  min="1"
                  step="1"
                  required
                />
              </div>
              
              <p className="text-xs text-gray-400 mt-1">
                Минимум: 100 ₽ · Максимум за раз: 30 000 ₽<br />
                Лимит в день: 30 000 ₽ · В месяц: 100 000 ₽
              </p>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 bg-gray-800 border border-cyan-500/30 rounded cursor-pointer"
                />
                <label htmlFor="agree" className="text-sm text-gray-300 leading-relaxed">
                  Я принимаю{' '}
                  <button
                    type="button"
                    onClick={() => setActiveModal('offer')}
                    className="text-cyan-400 underline"
                  >
                    оферту
                  </button>
                  ,{' '}
                  <button
                    type="button"
                    onClick={() => setActiveModal('privacy')}
                    className="text-cyan-400 underline"
                  >
                    Политику конфиденциальности
                  </button>{' '}
                  и даю согласие на{' '}
                  <button
                    type="button"
                    onClick={() => setActiveModal('consent')}
                    className="text-cyan-400 underline"
                  >
                    обработку персональных данных
                  </button>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-cyan-500 text-white font-bold py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Обработка...' : 'Пополнить'}
              </button>
            </form>
          </div>
        </main>

        <footer className="mt-16 bg-gray-900/50 border-t border-cyan-500/20 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-cyan-400 font-semibold mb-4 flex items-center gap-2">
              <FileText size={20} />
              Документы
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => setActiveModal('offer')}
                className="text-left text-gray-300 flex items-center gap-2 p-2 rounded"
              >
                <FileText size={16} />
                Оферта
              </button>
              <button
                onClick={() => setActiveModal('privacy')}
                className="text-left text-gray-300 flex items-center gap-2 p-2 rounded"
              >
                <Shield size={16} />
                Политика конфиденциальности
              </button>
              <button
                onClick={() => setActiveModal('consent')}
                className="text-left text-gray-300 flex items-center gap-2 p-2 rounded"
              >
                <UserCheck size={16} />
                Согласие на обработку данных
              </button>
              <button
                onClick={() => setActiveModal('refusal')}
                className="text-left text-gray-300 flex items-center gap-2 p-2 rounded"
              >
                <XCircle size={16} />
                Отказ от услуги
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-6 text-center">
              © 2024 TOR PAYMENTS. Все права защищены.
            </p>
          </div>
        </footer>
      </div>

      {/* Модалки всегда смонтированы, мгновенное открытие */}
      <Modal isOpen={activeModal === 'offer'} onClose={() => setActiveModal(null)} title="Публичная оферта">
        <OfferDocument />
      </Modal>

      <Modal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} title="Политика конфиденциальности">
        <PrivacyPolicyDocument />
      </Modal>

      <Modal isOpen={activeModal === 'consent'} onClose={() => setActiveModal(null)} title="Согласие на обработку персональных данных">
        <PersonalDataConsentDocument />
      </Modal>

      <Modal isOpen={activeModal === 'refusal'} onClose={() => setActiveModal(null)} title="Отказ от услуги">
        <ServiceRefusalDocument />
      </Modal>

      <PaymentModal isOpen={isPaymentModalOpen} />
      <QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} qrData={paymentData} />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
