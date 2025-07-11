import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const FeedbackMessage: React.FC<Props> = ({ type, message, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(onClose, 5000);
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div
      className={`relative mb-4 px-4 py-3 rounded border-l-4 ${
        type === 'success'
          ? 'bg-green-900 text-white border-purple-500'
          : 'bg-red-900 text-white border-purple-500'
      }`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-white hover:text-purple-300"
        aria-label="Fechar"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default FeedbackMessage;
