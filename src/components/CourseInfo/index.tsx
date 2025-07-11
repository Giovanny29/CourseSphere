import React from 'react';
import { Course, User } from '../../types';
import { Crown } from 'lucide-react'; // Mantendo apenas Crown já que Star não será usado agora

interface CourseInfoProps {
  course: Course | null;
  users: User[];
}

const CourseInfo: React.FC<CourseInfoProps> = ({ course, users }) => {
  if (!course) return null;

  const getUserNameById = (id: string) =>
    users.find((u) => u.id === id)?.name || `ID ${id} (Desconhecido)`;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      console.error('CourseSphere: Erro ao formatar data:', dateStr, error);
      return 'Data Inválida';
    }
  };

  const creatorName = getUserNameById(course.creator_id);

  return (
    <section className="mb-10 bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-700">
      <h1 className="break-words text-3xl sm:text-4xl md:text-5xl font-extrabold text-indigo-300 tracking-tight mb-4 leading-tight">
        {course.name}
      </h1>

      <div className="text-sm text-gray-400 mb-5 flex flex-col sm:flex-row gap-3 sm:gap-6">
        <span className="flex items-center gap-1">
          <span aria-hidden="true">📅</span> Início:{' '}
          {formatDate(course.start_date)}
        </span>
        <span className="flex items-center gap-1">
          <span aria-hidden="true">⏳</span> Fim: {formatDate(course.end_date)}
        </span>
      </div>

      <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
        {course.description || 'Nenhuma descrição fornecida para este curso.'}
      </p>

      {/* Seção para o Instrutor Principal (Criador do Curso) - MAIS DESTAQUE */}
      <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-purple-600 shadow-inner">
        <h2 className="text-xl font-bold text-purple-300 mb-3 flex items-center gap-2">
          <Crown size={24} className="text-yellow-400" /> Instrutor Principal:
        </h2>
        <p className="text-xl text-yellow-300 font-bold pl-2">
          {' '}
          {/* Alterado text-white para text-yellow-300 e adicionado font-bold, text-xl */}
          {creatorName}
        </p>
      </div>

      {/* Seção para Outros Instrutores (excluindo o criador, se ele já for o principal) */}
      {course.instructors.length > 0 && (
        <div className="mt-6">
          {course.instructors.filter((id) => id !== course.creator_id).length >
            0 && (
            <>
              <h2 className="text-xl font-bold text-indigo-300 mb-3 border-b border-gray-700 pb-2">
                Outros Instrutores:
              </h2>
              <ul className="pl-4 space-y-2 text-blue-300 text-base list-disc">
                {' '}
                {/* Alterado text-gray-300 para text-blue-300 */}
                {course.instructors
                  .filter((id) => id !== course.creator_id)
                  .map((id) => (
                    <li key={id} className="flex items-center gap-2">
                      <span aria-hidden="true">👤</span> {getUserNameById(id)}
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default CourseInfo;
