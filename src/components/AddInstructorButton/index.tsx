import React from 'react';

interface AddInstructorButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const AddInstructorButton: React.FC<AddInstructorButtonProps> = ({
  onClick,
  isLoading,
}) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className="mb-6 px-4 py-2 bg-green-600 hover:bg-green-500 rounded disabled:opacity-50 transition"
  >
    {isLoading ? 'Adicionando...' : 'Adicionar Novo Instrutor'}
  </button>
);

export default AddInstructorButton;
