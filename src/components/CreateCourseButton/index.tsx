import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCourseButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/courses/create');
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      + Novo Curso
    </button>
  );
};

export default CreateCourseButton;
