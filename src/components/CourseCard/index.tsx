import React from 'react';
import { Course } from '../../types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const formattedDates = `${format(new Date(course.start_date), 'dd/MM/yyyy')} - ${format(
    new Date(course.end_date),
    'dd/MM/yyyy',
  )}`;

  const descriptionTooLong =
    course.description && course.description.length > 160;

  return (
    <div className="bg-gray-800 text-white rounded-2xl shadow-xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-purple-400/20 group h-full">
      {/* Título */}
      <h3 className="text-2xl font-extrabold font-serif mb-2 truncate transition-colors duration-300 group-hover:text-purple-400">
        {course.name}
      </h3>

      {/* Datas */}
      <p className="text-sm text-gray-400 mb-3 italic group-hover:text-purple-300 transition-colors">
        {formattedDates}
      </p>

      {/* Descrição */}
      {course.description && (
        <p className="text-base text-gray-200 font-light leading-relaxed line-clamp-4 transition-colors duration-300 group-hover:text-purple-100">
          {descriptionTooLong ? (
            <>
              {course.description.slice(0, 150)}...{' '}
              <Link
                to={`/courses/${course.id}`}
                className="text-purple-400 hover:underline font-medium"
              >
                mais
              </Link>
            </>
          ) : (
            course.description
          )}
        </p>
      )}
    </div>
  );
};

export default CourseCard;
