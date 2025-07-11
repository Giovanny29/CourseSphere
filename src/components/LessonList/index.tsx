import React from 'react';
import { Lesson } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';

interface LessonListProps {
  lessons: Lesson[];
  getUserNameById: (id: string) => string;
  isCreator: boolean;
  userId: string;
  onDeleteLesson: (lessonId: string) => void;
}

const LessonList: React.FC<LessonListProps> = ({
  lessons,
  getUserNameById,
  isCreator,
  userId,
  onDeleteLesson,
}) => {
  const navigate = useNavigate();

  if (lessons.length === 0) {
    return <p className="text-gray-400">Nenhuma aula encontrada.</p>;
  }

  const handleEdit = (lessonId: string) => {
    navigate(`/lessons/edit/${lessonId}`);
  };

  return (
    <ul className="space-y-4">
      {lessons.map((lesson) => (
        <li
          key={lesson.id}
          className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:items-center justify-between"
        >
          <div className="flex items-start gap-4">
            <video
              src={lesson.video_url}
              className="w-40 h-24 object-cover rounded-md"
              controls
            />
            <div>
              <h3 className="text-xl font-bold">{lesson.title}</h3>
              <p className="text-sm text-gray-400">
                Publicado em: {lesson.publish_date}
              </p>
              <p className="text-sm text-gray-400">Status: {lesson.status}</p>
              <p className="text-sm text-gray-400">
                Instrutor: {getUserNameById(lesson.creator_id)}
              </p>
            </div>
          </div>

          {(isCreator || lesson.creator_id === userId) && (
            <div className="mt-4 sm:mt-0 sm:ml-6 space-x-2 flex">
              <button
                onClick={() => handleEdit(lesson.id)}
                title="Editar Aula"
                className="flex items-center gap-1 px-3 py-1 bg-yellow-500 rounded hover:bg-yellow-400 transition-colors duration-200 transform hover:scale-105"
              >
                <Edit2 size={16} />
                Editar
              </button>
              <button
                onClick={() => onDeleteLesson(lesson.id)}
                title="Excluir Aula"
                className="flex items-center gap-1 px-3 py-1 bg-red-600 rounded hover:bg-red-500 transition-colors duration-200 transform hover:scale-105"
              >
                <Trash2 size={16} />
                Excluir
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default LessonList;
