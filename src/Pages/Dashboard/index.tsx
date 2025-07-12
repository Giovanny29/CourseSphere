import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../../types';
import CourseList from '../../components/CourseList';
import CreateCourseButton from '../../components/CreateCourseButton';
import Footer from '../../components/Footer';
import CourseFilter from '../../components/CouseFilter';
import { filterCourses } from '../../utils/courseFilters';
import { paginate, getTotalPages } from '../../utils/pagination';
import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination'; // Importar o componente Pagination

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseNameFilter, setCourseNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const userId = localStorage.getItem('userId')!;
  const userEmail = localStorage.getItem('userEmail') || 'Usuário';
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  useEffect(() => {
    if (!userId || !isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchCourses = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const res = await fetch('http://localhost:3001/courses');
        if (!res.ok) {
          throw new Error('Falha ao buscar cursos');
        }
        const data: Course[] = await res.json();
        const filtered = data.filter(
          (course) =>
            course.creator_id === userId || course.instructors.includes(userId),
        );
        setCourses(filtered);
      } catch (err) {
        console.error('CourseSphere: Erro ao buscar cursos:', err);
        alert(
          'CourseSphere: Erro ao carregar seus cursos. Tente novamente mais tarde.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate, userId, isAuthenticated]);

  const filteredCourses = filterCourses(courses, {
    courseNameQuery: courseNameFilter,
  });

  const totalPages = getTotalPages(filteredCourses.length, itemsPerPage);
  const paginatedCourses = paginate(filteredCourses, currentPage, itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filteredCourses.length, totalPages, currentPage]);

  const goToPrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const handleCreateCourse = () => {
    navigate('/courses/create');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-purple-900 text-white font-sans">
      <Header userEmail={userEmail} userId={userId} />

      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h2 className="text-5xl font-extrabold font-serif bg-gradient-to-r from-green-300 via-green-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg">
            Meus Cursos
          </h2>
          <CreateCourseButton onClick={handleCreateCourse} />
        </div>

        <CourseFilter
          searchQuery={courseNameFilter}
          onSearchChange={(value) => {
            setCourseNameFilter(value);
            setCurrentPage(1);
          }}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : paginatedCourses.length === 0 ? (
          <p className="text-center text-gray-300 text-xl mt-12 py-8 bg-gray-800 rounded-lg shadow-md border border-gray-700">
            Nenhum curso encontrado. Crie um novo curso para começar!
          </p>
        ) : (
          <>
            <div className="mt-8">
              <CourseList
                courses={paginatedCourses}
                onCourseClick={handleCourseClick}
              />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevPage={goToPrevPage}
              onNextPage={goToNextPage}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
