import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

const CreateCourseButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/create-course')}
      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-green-500 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300"
    >
      <FiPlus className="text-xl" />
      Novo Curso
    </button>
  );
};

export default CreateCourseButton;
