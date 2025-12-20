import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="bg-gray-900 border-2 border-cyan-500/30 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl shadow-cyan-500/20 animate-fadeIn">
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/30 bg-gradient-to-r from-gray-800 to-gray-900">
          <h2 className="text-xl font-bold text-cyan-400">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] text-gray-300 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
