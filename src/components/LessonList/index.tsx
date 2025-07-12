import React from 'react';
import { Lesson } from '../../types';
import { Edit, Trash2 } from 'lucide-react';

interface LessonListProps {
  lessons: Lesson[];
  getUserNameById: (uid: string) => string;
  isCreator: boolean;
  userId: string;
  onDeleteLesson: (lessonId: string) => void;
  onEditLesson: (lessonId: string) => void;
}

const LessonList: React.FC<LessonListProps> = ({
  lessons,
  getUserNameById,
  isCreator,
  userId,
  onDeleteLesson,
  onEditLesson,
}) => {
  if (lessons.length === 0) {
    return (
      <p className="text-center text-gray-400 text-lg py-4">
        Nenhuma aula encontrada.
      </p>
    );
  }

  const handleEdit = (lessonId: string) => {
    onEditLesson(lessonId);
  };

  return (
    <ul className="space-y-4">
      {lessons.map((lesson) => (
        <li
          key={lesson.id}
          className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-700 transition-all duration-200 hover:scale-[1.01] hover:border-blue-500"
        >
          <div className="flex-grow mb-3 sm:mb-0">
            <h3 className="text-xl font-semibold text-white break-words pr-4">
              {lesson.title}
            </h3>
            <p className="text-sm text-gray-400">
              Status:{' '}
              <span
                className={`font-medium ${
                  lesson.status === 'published'
                    ? 'text-green-400'
                    : lesson.status === 'archived'
                      ? 'text-gray-400'
                      : 'text-yellow-400'
                }`}
              >
                {lesson.status === 'published'
                  ? 'Publicado'
                  : lesson.status === 'archived'
                    ? 'Arquivado'
                    : 'Rascunho'}
              </span>
            </p>
            <p className="text-sm text-gray-400">
              Publicado em:{' '}
              {new Date(lesson.publish_date).toLocaleDateString('pt-BR')}
            </p>
            <p className="text-sm text-gray-400">
              Criado por: {getUserNameById(lesson.creator_id)}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {(isCreator || lesson.creator_id === userId) && (
              <button
                onClick={() => handleEdit(lesson.id)}
                className="p-2 bg-blue-600 rounded-full hover:bg-blue-500 transition duration-200 shadow-md"
                aria-label={`Editar aula ${lesson.title}`}
                title="Editar Aula"
              >
                <Edit size={18} />
              </button>
            )}
            {(isCreator || lesson.creator_id === userId) && (
              <button
                onClick={() => onDeleteLesson(lesson.id)}
                className="p-2 bg-red-600 rounded-full hover:bg-red-500 transition duration-200 shadow-md"
                aria-label={`Excluir aula ${lesson.title}`}
                title="Excluir Aula"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default LessonList;
