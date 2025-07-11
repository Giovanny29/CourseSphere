import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface DeleteCourseButtonProps {
  courseId: string;
}

const DeleteCourseButton: React.FC<DeleteCourseButtonProps> = ({
  courseId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const noButtonRef = useRef<HTMLButtonElement>(null);

  // Coloca o foco no botão "Não" ao abrir o modal
  useEffect(() => {
    if (isModalOpen) {
      noButtonRef.current?.focus();
    }
  }, [isModalOpen]);

  const closeModal = () => setIsModalOpen(false);

  const handleDelete = async () => {
    try {
      // Buscar aulas associadas ao curso
      const resLessons = await fetch(
        `http://localhost:3001/lessons?course_id=${courseId}`,
      );
      if (!resLessons.ok) throw new Error('Erro ao buscar aulas');
      const lessons = await resLessons.json();

      // Excluir todas as aulas
      await Promise.all(
        lessons.map((lesson: { id: string }) =>
          fetch(`http://localhost:3001/lessons/${lesson.id}`, {
            method: 'DELETE',
          }),
        ),
      );

      // Excluir o curso
      const resCourse = await fetch(
        `http://localhost:3001/courses/${courseId}`,
        {
          method: 'DELETE',
        },
      );
      if (!resCourse.ok) throw new Error('Erro ao excluir curso');

      alert('Curso e aulas excluídos com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      alert('Erro ao excluir curso e aulas.');
      console.error(error);
    }

    closeModal();
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition text-white"
      >
        Excluir Curso
      </button>

      {isModalOpen && (
        <>
          {/* Overlay blur no fundo */}
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-40" />

          {/* Modal centralizado */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Confirma exclusão do curso?
              </h3>
              <p className="mb-6 text-gray-300">
                Essa ação excluirá o curso e todas as aulas associadas. Tem
                certeza?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  ref={noButtonRef}
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition text-white"
                >
                  Não
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition text-white"
                >
                  Sim, excluir
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DeleteCourseButton;
