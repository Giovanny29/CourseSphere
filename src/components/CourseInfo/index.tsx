import React from 'react';
import { Course, User } from '../../types';

interface CourseInfoProps {
  course: Course | null;
  users: User[];
}

const CourseInfo: React.FC<CourseInfoProps> = ({ course, users }) => {
  if (!course) return null;

  const getUserNameById = (id: string) =>
    users.find((u) => u.id === id)?.name || id;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <section className="mb-10 bg-gray-800 rounded-2xl p-6 shadow-xl border border-purple-700">
      <h1 className="test-font break-words text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
        {course.name}
      </h1>

      <div className="text-sm text-gray-400 mb-5 flex flex-col sm:flex-row gap-3 sm:gap-6">
        <span>📅 Início: {formatDate(course.start_date)}</span>
        <span>⏳ Fim: {formatDate(course.end_date)}</span>
      </div>

      <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
        {course.description || 'Sem descrição fornecida para este curso.'}
      </p>

      {course.instructors.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Instrutores:
          </h2>
          <ul className="pl-4 space-y-1 text-gray-300 text-base list-disc">
            {course.instructors.map((id) => (
              <li key={id}>👤 {getUserNameById(id)}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default CourseInfo;
