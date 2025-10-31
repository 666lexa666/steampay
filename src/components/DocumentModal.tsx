import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: string;
}

const documentContent: Record<string, { title: string; content: string }> = {
  offer: { title: 'Публичная оферта', content: `<p>Содержание оферты...</p>` },
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
