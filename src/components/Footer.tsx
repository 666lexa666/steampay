import React from 'react';
import { Mail, Phone } from 'lucide-react';

interface FooterProps {
  onOpenDocumentModal: (type: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenDocumentModal }) => {
  const documents = [
    { key: 'offer', title: 'Оферта' },
    { key: 'privacy', title: 'Политика конфиденциальности' },
    { key: 'consent', title: 'Согласие на обработку данных' },
    { key: 'refusal', title: 'Отказ от услуги' }
  ];

  return (
    <footer
      id="contact"
      className="relative bg-black/40 border-t border-gray-700 overflow-hidden"
    >
      {/* Gaming footer background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <img
          src="/images/footer.jpg"
          alt="footer background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Documents Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Документы</h3>
            <div className="space-y-2">
              {documents.map((doc) => (
                <button
                  key={doc.key}
                  onClick={() => onOpenDocumentModal(doc.key)}
                  className="block text-cyan-400 hover:text-cyan-300 transition-colors underline text-left
                             hover:shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                >
                  {doc.title}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Контакты</h3>
            <div className="space-y-3">
              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-cyan-400" />
                <a
                  href="mailto:kudurettilla@icloud.com"
                  className="text-gray-300 hover:text-cyan-400 transition-colors
                             hover:shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                >
                  kudurettilla@icloud.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400">
            © 2025 SteamPay. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
