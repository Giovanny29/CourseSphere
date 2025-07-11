import React, { useState } from 'react';
import ModalConfirm from '../ModalConfirm';

interface DeleteLessonButtonProps {
  lessonId: string;
  onDeleted: () => void; // Callback para atualizar lista após exclusão
}

const DeleteLessonButton: React.FC<DeleteLessonButtonProps> = ({
  lessonId,
  onDeleted,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3001/lessons/${lessonId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao excluir aula');
      onDeleted();
    } catch (error) {
      alert('Erro ao excluir aula.');
      console.error(error);
    }
    closeModal();
  };

  return (
    <>
      <button
        className="px-3 py-1 bg-red-600 rounded hover:bg-red-500"
        onClick={openModal}
      >
        Excluir
      </button>

      {modalVisible && (
        <ModalConfirm
          message="Tem certeza que deseja excluir esta aula?"
          onCancel={closeModal}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default DeleteLessonButton;
