import React from 'react';
import { PlusCircle } from 'lucide-react';

interface CreateCourseButtonProps {
  onClick: () => void;
}

const CreateCourseButton: React.FC<CreateCourseButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-6 py-3 bg-purple-700 rounded-full hover:bg-purple-600 transition duration-300 ease-in-out text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      aria-label="Criar novo curso"
    >
      <PlusCircle size={20} /> Criar Novo Curso
    </button>
  );
};

export default CreateCourseButton;
