import { Lesson } from '../types';

interface FilterOptions {
  searchQuery?: string;
  statusFilter?: string;
  courseFilter?: string;
}

export function filterLessons(
  lessons: Lesson[],
  { searchQuery = '', statusFilter = '', courseFilter = '' }: FilterOptions,
): Lesson[] {
  return lessons.filter((lesson) => {
    const matchesTitle = lesson.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? lesson.status === statusFilter : true;
    const matchesCourse = courseFilter
      ? lesson.course_id === courseFilter
      : true;
    return matchesTitle && matchesStatus && matchesCourse;
  });
}

export function getUniqueCourses(lessons: Lesson[]) {
  const courseMap = new Map<string, string>();
  lessons.forEach((lesson) => {
    if (!courseMap.has(lesson.course_id)) {
      courseMap.set(lesson.course_id, lesson.course_id); // ou buscar nome real do curso se necessário
    }
  });
  return Array.from(courseMap.entries()).map(([id, name]) => ({ id, name }));
}
