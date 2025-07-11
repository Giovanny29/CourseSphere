import React, { useEffect, useRef } from 'react';

interface ModalConfirmProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  title = 'Confirmação',
  message,
  onConfirm,
  onCancel,
}) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
    >
      {/* Fundo só com blur */}
      <div className="fixed inset-0 backdrop-blur-md" onClick={onCancel} />

      {/* Caixa do modal com borda arroxeada */}
      <div className="bg-gray-900 rounded-lg p-6 z-10 max-w-md mx-4 text-white shadow-lg border-2 border-purple-600">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
          >
            Não
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
