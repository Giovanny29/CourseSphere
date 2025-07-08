import React from 'react';
import { Course } from '../../types/Course';

interface CourseCardProps {
  course: Course;
  instructorName?: string;
}

const images = [
  '/img/cursos/curso1.png',
  '/img/cursos/curso2.png',
  '/img/cursos/curso3.png',
  '/img/cursos/curso4.png',
  '/img/cursos/curso5.png',
];

const CourseCard: React.FC<CourseCardProps> = ({ course, instructorName }) => {
  const imgIndex =
    course.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    images.length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div
      className="group bg-gray-800 rounded-lg shadow-lg overflow-visible cursor-pointer
                 transform transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(139,92,246,0.7)]"
    >
      <a
        href={`/courses/${course.id}`}
        className="block rounded-t-lg overflow-hidden" // aqui overflow-hidden
      >
        <img
          src={images[imgIndex]}
          alt={course.name}
          className="w-full h-40 object-cover rounded-t-lg
                     transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </a>
      <div className="p-4 text-white">
        <h2 className="text-xl font-semibold mb-1">{course.name}</h2>
        {course.description && (
          <p className="text-gray-300 mb-2 line-clamp-2">
            {course.description}
          </p>
        )}

        <p className="text-sm text-indigo-300 mb-1">
          <span className="font-semibold">Início:</span>{' '}
          {formatDate(course.start_date)}
        </p>
        <p className="text-sm text-indigo-300 mb-3">
          <span className="font-semibold">Fim:</span>{' '}
          {formatDate(course.end_date)}
        </p>

        {instructorName && (
          <p className="text-sm text-indigo-400 italic">
            Instrutor: {instructorName}
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
