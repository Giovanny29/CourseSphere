import React from 'react';
import { Course } from '../../types';
import CourseCard from '../CourseCard';

interface Props {
  courses: Course[];
  onCourseClick: (courseId: string) => void; // Adicionada a prop onCourseClick
}

const CourseList: React.FC<Props> = ({ courses, onCourseClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onCourseClick={onCourseClick}
        />
      ))}
    </div>
  );
};

export default CourseList;
