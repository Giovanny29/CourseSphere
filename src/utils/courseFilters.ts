import { Course } from '../types';

export function filterCourses(
  courses: Course[],
  { courseNameQuery = '' }: { courseNameQuery?: string },
): Course[] {
  return courses.filter((course) =>
    course.name.toLowerCase().includes(courseNameQuery.toLowerCase()),
  );
}
