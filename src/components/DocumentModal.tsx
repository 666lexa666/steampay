import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: string;
}

const documentContent: Record<string, { title: string; content: string }> = {
  offer: {
  title: 'Публичная оферта',
  content: `<p>Публичная оферта Общество с ограниченной ответственностью "ВЕРОНИКА" (ОсОО "ВЕРОНИКА"), Limited Liability Company Veronika (LLC Veronika), регистрационный номер КР: 320976-3301-ООО, любому дееспособному лицу (далее — Пользователь) заключить договор на оказание услуг по пополнению баланса Steam.</p>

<p>1. Общие положения</p>
<p>1.1. Настоящая публичная оферта (далее — Оферта) является официальным предложением ОсОО "ВЕРОНИКА" по оказанию услуг пополнения баланса Steam.</p>
<p>1.2. Акцепт Оферты осуществляется путем оплаты услуг любым способом, доступным на сайте odin-god-steam.ru, включая оплату по QR-коду.</p>

<p>2. Предмет договора</p>
<p>2.1. Исполнитель обязуется по поручению Пользователя пополнить баланс Steam на указанную сумму.</p>
<p>2.2. Стоимость услуги составляет 0% от суммы пополнения.</p>
<p>2.3. Ограничения по сумме пополнений: лимит на одного плательщика — 10,000₽ в сутки | 100,000₽ в месяц (сброс лимитов происходит по московскому времени). Исполнитель не несет ответственности за попытки превышения указанных лимитов; такие операции могут быть отклонены.</p>

<p>3. Порядок оказания услуг</p>
<p>3.1. Пользователь указывает Логин Steam и сумму пополнения. После чего формируется QR-код для оплаты.</p>
<p>3.2. После подтверждения платежа услуги оказываются в течение 30 минут.</p>
<p>3.3. Услуги считаются оказанными с момента зачисления средств на баланс Steam.</p>

<p>4. Порядок оплаты</p>
<p>4.1. Оплата осуществляется исключительно в российских рублях (RUB) по QR-коду напрямую в банк.</p>
<p>4.2. Оплата считается произведенной с момента поступления средств на счет Исполнителя.</p>
<p>4.3. Возврат средств возможен только при невозможности оказания услуги по вине Исполнителя.</p>

<p>5. Ответственность</p>
<p>5.1. Исполнитель не несет ответственности за действия Steam, банков и платёжных сервисов.</p>
<p>5.2. Пользователь отвечает за достоверность предоставленных данных.</p>

<p>6. Права и обязанности</p>
<p>6.1. Исполнитель обязуется: своевременно оказывать услуги, хранить конфиденциальность, информировать о сбоях.</p>
<p>6.2. Пользователь обязуется: предоставлять достоверные данные, не использовать сервис для незаконных целей, оплачивать услуги.</p>

<p>7. Форс-мажор</p>
<p>7.1. Стороны освобождаются от ответственности за обстоятельства непреодолимой силы.</p>

<p>8. Разрешение споров</p>
<p>8.1. Досудебный порядок: претензии направляются на odingodsteam.ru@gmail.com, срок ответа 15 рабочих дней.</p>
<p>8.2. Споры, не урегулированные досудебно, передаются в суд по законодательству РФ.</p>

<p>9. Заключительные положения</p>
<p>9.1. Настоящая Оферта размещена на сайте odin-god-steam.ru.</p>
<p>9.2. Изменения вступают в силу с момента публикации.</p>
<p>9.3. Реквизиты:</p>
<p>Общество с ограниченной ответственностью "ВЕРОНИКА" (ОсОО "ВЕРОНИКА")<br/>
Limited Liability Company Veronika (LLC Veronika)<br/>
Регистрационный номер КР: 320976-3301-ООО<br/>
КР ИНН: —<br/>
РФ ИНН: 9909747653, КПП: 773687001<br/>
Юридический адрес: Кыргызская Республика, Бишкек, Свердловский район, ул. Чалдыбар (ж/м Ак-Тилек), 2а<br/>
Ванян Тигран Паргевович<br/>
Тел.: +79259198199<br/>
E-mail: kudurettilla@icloud.com</p>`
},
  privacy: { title: 'Политика конфиденциальности', content: `<p>Содержание политики...</p>` },
  consent: { title: 'Согласие на обработку персональных данных', content: `<p>Содержание согласия...</p>` },
  refusal: { title: 'Отказ от услуги', content: `<p>Содержание отказа...</p>` },
};

const DocumentModal: React.FC<DocumentModalProps> = ({ isOpen, onClose, documentType }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    // TS не ругается, если явно проверяем body
    const body = document.body;
    if (body) body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (body) body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !documentContent[documentType]) return null;

  const documentItem = documentContent[documentType];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden transform transition-all scale-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="document-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 id="document-modal-title" className="text-2xl font-bold text-white">
            {documentItem.title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Закрыть">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-96 pr-2">
          <div
            className="text-gray-300 prose prose-sm max-w-none prose-headings:text-white prose-headings:font-bold prose-p:text-gray-300 prose-ul:text-gray-300 prose-li:text-gray-300"
            dangerouslySetInnerHTML={{ __html: documentItem.content }}
          />
        </div>

        {/* Close Button */}
        <div className="mt-6 pt-6 border-t border-gray-700">
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

export default DocumentModal;
